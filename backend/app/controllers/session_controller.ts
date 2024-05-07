import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { signinValidator } from '#validators/user'
import mail from '@adonisjs/mail/services/main'
import jwt from 'jsonwebtoken'

export default class SessionController {
  async requestLoginLink({ request, response }: HttpContext) {
    const data = request.all()

    const validator = await signinValidator.validate(data)

    if (!validator) {
      return response.status(422).json({ message: 'Veuillez fournir une adresse e-mail valide.' })
    }

    let user: User | null = await User.firstOrCreate({ email: validator.email })

    if (!user) {
      return response.status(404).json({ message: 'Utilisateur non trouvé.' })
    }

    user.magic_link_token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      `${process.env.SECRET_KEY_JWT}`,
      { expiresIn: '1h' }
    )
    user.magic_link_token_expires_at = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()
    await user.save()
    await this.sendLoginEmail(user)

    return response
      .status(200)
      .json({ message: 'Veuillez consulter votre boîte de réception pour vous connecter.' })
  }

  async sendLoginEmail(user: User) {
    await mail.use('resend').sendLater((message) => {
      message.from('contact@plumera.fr').to(user.email).subject('Invitation à rejoindre une équipe')
        .html(`
        <!DOCTYPE html>
        <html lang="fr">
          <head>
            <title>Invitation à signer un document</title>
          </head>
          <body>
           <p>
             Cliquez sur le lien ci-dessous pour vous connecter:
             http://localhost:3000/verify/?magic_link_token=${user.magic_link_token}
           </p>
          </body>
        </html>
        `)
    })
  }

  async loginWithToken({ params, response, auth }: HttpContext) {
    const token = params.id

    const user: User = await User.query()
      .where('magic_link_token', token)
      .whereNotNull('magic_link_token_expires_at')
      .where('magic_link_token_expires_at', '>=', new Date().toISOString())
      .firstOrFail()

    if (
      user.magic_link_token_expires_at &&
      new Date(user.magic_link_token_expires_at) < new Date()
    ) {
      return response.status(401).json({ message: 'Jeton de connexion expiré.' })
    }

    user.magic_link_token_expires_at = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()
    await user.save()

    const accessToken = await user.generateToken()

    await auth.use('web').login(user)

    response.status(200).json({ message: 'Connecté avec succès.', access_token: accessToken })
  }

  async connectToGoogle({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }



  async store({ ally, auth, response }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      // TODO: Handle access denied exception
      return 'Access was denied'
    }

    if (google.stateMisMatch()) {
      // TODO: Handle mismatch state
      return 'Request expired. Retry again'
    }

    if (google.hasError()) {
      // TODO: Handle error
      return google.getError()
    }

    const GoogleUser = await google.user()

    const user: User = await User.firstOrCreate(
      { google_id: GoogleUser.id },
      {
        full_name: GoogleUser.name,
        email: GoogleUser.email,
      }
    )

    await auth.use('web').login(user)

    return response.ok({ message: 'Connecté avec succès.', user })
  }

  async whoami({ auth, response }: HttpContext) {
    auth.use('web').user

    return response.ok(auth.user)
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.ok({ message: 'Déconnecté avec succès.' })
  }
}
