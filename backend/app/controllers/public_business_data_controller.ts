import { HttpContext } from '@adonisjs/core/http'
import PublicBusinessData from '#models/public_business_data'
import {
  createPublicBusinessDataValidator,
  updatePublicBusinessDataValidator,
} from '#validators/public_business_data'
import User from '#models/user'

export default class PublicBusinessDataController {
  /**
   * Display a list of resource
   */
  async index({ auth, response }: HttpContext) {
    const user: User = auth.user!
    const publicBusinessData = await PublicBusinessData.query().where('user_id', user.id).exec()
    return response.ok(publicBusinessData)
  }

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.all()

    const validation = await createPublicBusinessDataValidator.validate(data)

    if (!validation) {
      return response.badRequest(validation)
    }

    const publicBusinessData: PublicBusinessData = await PublicBusinessData.create(data)

    return response.created(publicBusinessData)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const publicBusinessData = await PublicBusinessData.find(params.id)

    if (!publicBusinessData) {
      return response.notFound()
    }

    return response.ok(publicBusinessData)
  }

  /**
   * Edit individual record
   */
  async edit({ params, response }: HttpContext) {
    const publicBusinessData = await PublicBusinessData.find(params.id)

    if (!publicBusinessData) {
      return response.notFound()
    }

    return response.ok(publicBusinessData)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const data = request.all()

    const validation = await updatePublicBusinessDataValidator.validate(data)

    if (!validation) {
      return response.badRequest(validation)
    }

    const publicBusinessData: PublicBusinessData | null = await PublicBusinessData.find(params.id)

    if (!publicBusinessData) {
      return response.notFound()
    }

    publicBusinessData.merge(data)

    await publicBusinessData.save()

    return response.ok(publicBusinessData)
  }

  async sirene({ request, response }: HttpContext) {
    const data = request.only(['siren_number'])

    return response.ok(data)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const publicBusinessData: PublicBusinessData | null = await PublicBusinessData.find(params.id)

    if (!publicBusinessData) {
      return response.notFound()
    }

    await publicBusinessData.delete()

    return response.noContent()
  }
}
