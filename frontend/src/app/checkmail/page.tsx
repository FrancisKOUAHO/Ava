'use client'

const Page = () => {
  return (
    <div className="flex min-h-full flex-col text-center justify-center sm:px-6 lg:p-8 p-8 h-[100vh] bg-[#110e3c]">
      <div className="m-auto justify-center">
        <div className="m-auto w-full justify-center">
          <div className="m-auto">
            <div className="m-auto">
              <button className="p-4 mb-8 text-sm font-medium rounded-lg bg-green-500 text-white">
                Succès
              </button>
            </div>
            <div className=" w-full m-auto mb-4">
              <p className="font-bold text-white text-xl">
                Consultez votre boîte aux lettres
              </p>
            </div>
            <p className="text-white text-base mb-4">
              Un lien de connexion a été envoyé à l'adresse électronique
              spécifiée.
            </p>
            <p className="text-white">
              Si vous ne l'avez pas reçu, vérifiez votre dossier de courrier
              indésirable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
