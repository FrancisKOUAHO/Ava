import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { signinValidator } from '#validators/user'
import mail from '@adonisjs/mail/services/main'
import jwt from 'jsonwebtoken'
import app from '@adonisjs/core/services/app'
import { v4 as uuidv4 } from 'uuid'

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
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invitation à connecter</title>
            <style>
              body { font-family: 'Arial', sans-serif; line-height: 1.6; }
              p { color: #333; }
            </style>
          </head>
          <body>
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
              <h1>Bienvenue chez Plumera!</h1>
              <p>
                Veuillez cliquer sur le lien ci-dessous pour vous connecter:
                <a href="https://app.plumera.fr/verify/?magic_link_token=${user.magic_link_token}" style="color: #0652DD;">Cliquez ici pour vous connecter</a>
              </p>
            </div>
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
      return 'Access was denied'
    }

    if (google.stateMisMatch()) {
      return 'Request expired. Retry again'
    }

    if (google.hasError()) {
      return google.getError()
    }

    const GoogleUser = await google.user()

    const user: User = await User.updateOrCreate(
      { google_id: GoogleUser.id },
      {
        full_name: GoogleUser.name,
        email: GoogleUser.email,
      }
    )

    await auth.use('web').login(user)

    return response.ok({ message: 'Connecté avec succès.', user })
  }

  async updateProfile({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id

    if (!userId) {
      response.abort('User not found')
      return
    }
    const user: User | null = await User.find(userId)

    if (!user) {
      response.abort('User not found')
      return
    }

    const avatar = request.file('logo', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })

    if (!avatar) {
      response.abort('Please upload an avatar')
      return
    }

    const randomFileName = `${uuidv4()}.${avatar.extname}`

    await avatar.move(app.makePath('public/uploads'), {
      name: randomFileName,
    })

    user.avatar = randomFileName
    await user.save()

    return response.ok({
      message: 'User updated successfully',
      user,
    })
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
