import { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import PublicBusinessData from '#models/public_business_data'
import env from '#start/env'

interface TypeVoieDictionary {
  [key: string]: string
}

const typeVoieDictionary: TypeVoieDictionary = {
  ALL: 'Allée',
  AV: 'Avenue',
  BD: 'Boulevard',
  CH: 'Chemin',
  CHEM: 'Chemin',
  IMP: 'Impasse',
  PL: 'Place',
  PT: 'Petite Route',
  RLE: 'Ruelle',
  RUE: 'Rue',
  SQ: 'Square',
  CRS: 'Cours',
  ESP: 'Esplanade',
  FBG: 'Faubourg',
  GDE: 'Grande',
  PAS: 'Passage',
  PCE: 'Place',
  QAI: 'Quai',
  RPT: 'Rond-Point',
  RT: 'Route',
  SENT: 'Sentier',
  TSSE: 'Terrasse',
  VLA: 'Villa',
  VOIE: 'Voie',
  CARF: 'Carrefour',
  CG: 'Chaussée',
  CITÉ: 'Cité',
  CLOS: 'Clos',
  CNE: 'Corniche',
  DOM: 'Domaine',
  LOT: 'Lotissement',
  MAIL: 'Mail',
  PARC: 'Parc',
  QU: 'Quartier',
}

interface CachedToken {
  value: string | null
  expiry: number | null
}

let cachedToken: CachedToken = {
  value: null,
  expiry: null,
}

export default class ScrappersController {
  getFullTypeVoie(abbreviation: string): string {
    const upperAbbreviation = abbreviation.toUpperCase()
    return typeVoieDictionary[upperAbbreviation] || abbreviation
  }

  async sirene({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.only(['siren_number'])

    const client = await axios.get(
      `https://api.insee.fr/entreprises/sirene/V3.11/siren/${data.siren_number}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SIRENE_API_KEY}`,
        },
      }
    )

    if (!client) {
      return response.notFound()
    }

    const publicBusinessData = await PublicBusinessData.create({
      user_id: user.id,
      siren_number: client.data.uniteLegale.siren,
      company_name: client.data.uniteLegale.prenomUsuelUniteLegale,
      legal_structure: client.data.uniteLegale.categorieEntreprise,
      legal_status: client.data.uniteLegale.statutDiffusionUniteLegale,
    })

    if (!publicBusinessData) {
      return response.badRequest()
    }

    return response.created('client')
  }

  async getSireneInfo({ request, response }: HttpContext) {
    const siren_number = request.input('siren_number')

    try {
      const token = await this.authenticate()
      if (!token) {
        return response.internalServerError('Failed to authenticate with SIRENE API')
      }

      const url = `https://registre-national-entreprises.inpi.fr/api/companies/${siren_number}`
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }

      const clientResponse = await axios.get(url, { headers })
      if (clientResponse.data && clientResponse.data.formality) {
        const data = clientResponse.data

        const fullTypeVoie = this.getFullTypeVoie(
          data.formality.content.personnePhysique.adresseEntreprise.adresse.typeVoie
        )
        const clientData = {
          first_name:
            data.formality.content.personnePhysique.identite.entrepreneur.descriptionPersonne.prenoms.join(
              ' '
            ),
          last_name:
            data.formality.content.personnePhysique.identite.entrepreneur.descriptionPersonne.nom,
          email: '',
          sirenNumber: siren_number,
          phone: '',
          address: `${data.formality.content.personnePhysique.adresseEntreprise.adresse.numVoie} ${fullTypeVoie} ${data.formality.content.personnePhysique.adresseEntreprise.adresse.voie}`,
          city: data.formality.content.personnePhysique.adresseEntreprise.adresse.commune,
          state: '',
          zip: data.formality.content.personnePhysique.adresseEntreprise.adresse.codePostal,
          country: data.formality.content.personnePhysique.adresseEntreprise.adresse.pays,
          company:
            data.formality.content.personnePhysique.etablissementPrincipal.descriptionEtablissement
              .nomCommercial,
          vat_number: '',
          currency: 'EUR',
          language: 'FR',
        }
        return response.ok(clientData)
      }
      return response.notFound('No data found for the provided SIREN number.')
    } catch (error) {
      console.error('Error fetching data for SIREN:', siren_number, error)
      return this.handleErrorResponse(error, response)
    }
  }

  async authenticate(): Promise<string> {
    const expiresIn = 3600 * 1000

    if (cachedToken && cachedToken.expiry && cachedToken.value && cachedToken.expiry > Date.now()) {
      return cachedToken.value
    }

    try {
      const response = await axios.post(
        'https://registre-national-entreprises.inpi.fr/api/sso/login',
        {
          username: env.get('INPI_EMAIL'),
          password: env.get('INPI_PASSWORD'),
        }
      )

      const { token } = response.data
      const lastLoginTime = new Date(response.data.user.lastLogin).getTime()

      const expiryTime = lastLoginTime + expiresIn

      cachedToken = {
        value: token,
        expiry: expiryTime,
      }

      return token
    } catch (error) {
      console.error("Échec de l'authentification:", error)
      throw new Error('Authentication failed')
    }
  }

  handleErrorResponse(error: any, response: HttpContext['response']) {
    if (error.response) {
      return response.status(error.response.status).send(error.response.data)
    } else if (error.request) {
      return response.internalServerError('Error setting up request to SIRENE API.')
    } else {
      return response.internalServerError('Error setting up request to SIRENE API.')
    }
  }
}
