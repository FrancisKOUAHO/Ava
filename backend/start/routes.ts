  /*
  |--------------------------------------------------------------------------
  | Routes file
  |--------------------------------------------------------------------------
  |
  | The routes file is used for defining the HTTP routes.
  |
  */

  import router from '@adonisjs/core/services/router'
  import { middleware } from '#start/kernel'

  const ScrappersController = () => import('#controllers/scrappers_controller')

  const SessionController = () => import('#controllers/session_controller')
  const InvoiceItemsController = () => import('#controllers/invoice_items_controller')
  const InvoicesController = () => import('#controllers/invoices_controller')
  const OrdersController = () => import('#controllers/orders_controller')
  const PaymentsController = () => import('#controllers/payments_controller')
  const PlansController = () => import('#controllers/plans_controller')
  const PublicBusinessDataController = () => import('#controllers/public_business_data_controller')
  const TaxInformationsController = () => import('#controllers/tax_informations_controller')
  const ClientsController = () => import('#controllers/clients_controller')

  router
    .group(() => {
      router.get('/', ({ response }) => response.ok({ uptime: Math.round(process.uptime()) }))
      router.get('health', ({ response }) => response.noContent())

      router
        .group(() => {
          router.post('request-login-link', [SessionController, 'requestLoginLink'])
          router.post('login/:id', [SessionController, 'loginWithToken'])
          router.get('connect-to-google', [SessionController, 'connectToGoogle'])
          router.get('signin-callback', [SessionController, 'store'])

          router
            .group(() => {
              router.get('whoami', [SessionController, 'whoami'])
              router.delete('sign-out', [SessionController, 'logout'])
            })
            .use([middleware.auth()])
        })
        .prefix('auth')

      router
        .group(() => {
          router
            .group(() => {
              router.resource('customer', ClientsController).apiOnly()
              router.resource('invoice-item', InvoiceItemsController).apiOnly()
              router.get('invoice-items/:invoice_id', [InvoiceItemsController,'getInvoiceItems'])
              router.post('invoice-item-many', [InvoiceItemsController, 'storeAll'])
              router.post('update-or-insert-invoice-item', [InvoiceItemsController, 'upsert'])
              router.get('invoice-data', [InvoicesController, 'getAllInvoiceData'])
                router.get('connect-to-google', [SessionController, 'connectToGoogle'])

              router.resource('invoice', InvoicesController).apiOnly()
            })
            .prefix('billing')

          router
            .group(() => {
              router.resource('public-business-data', PublicBusinessDataController).apiOnly()
              router.resource('tax-informations', TaxInformationsController).apiOnly()
              router.post('scrappe-sirene', [ScrappersController, 'sirene'])
              router.get('scrappe-sirene', [ScrappersController, 'getSireneInfo'])
            })
            .prefix('business-data')

          router.group(() => {
            router.resource('orders', OrdersController).apiOnly()
            router.resource('payments', PaymentsController).apiOnly()
            router.resource('plans', PlansController).apiOnly()
          })
        })
        .use([middleware.auth()])
    })
    .prefix('api/v1')
