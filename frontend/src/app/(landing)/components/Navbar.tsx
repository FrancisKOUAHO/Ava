import Link from 'next/link'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import MaxWidthWrapper from '@/app/(landing)/components/MaxWidthWrapper'
import { MobileNav } from '@/app/(landing)/components/MobileNav'

const Navbar = () => {
  const isUserSignedIn = false

  return (
    <nav
      className={cn(
        'sticky h-14 inset-x-0 top-0 z-30 border-b border-gray-200 backdrop-blur-lg transition-all',
      )}
    >
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link
            href="/"
            className="flex z-40 justify-center items-center gap-1"
          >
            <img
              src="/logo/icon-logo.png"
              alt="Plumera logo"
              className="w-[60px] h-[60px] "
            />
            <span className="text-2xl font-semibold">Plumera</span>
          </Link>
          <div className="flex gap-1 sm:gap-4 items-center">
            {!isUserSignedIn ? (
              <MobileNav />
            ) : (
              <Link
                className={buttonVariants({
                  size: 'sm',
                  className: 'sm:hidden mr-3',
                })}
                href="/dashboard"
              >
                Dashboard
              </Link>
            )}

            <div className="hidden items-center space-x-4 sm:flex">
              {!isUserSignedIn ? (
                <>
                  <Link
                    href="#pricing"
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}
                  >
                    Prix
                  </Link>
                  <Link
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    })}
                    href="/login"
                  >
                    Connectez-vous
                  </Link>
                  <Link
                    className={buttonVariants({
                      size: 'sm',
                    })}
                    href="/sign-up"
                  >
                    Get started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className={buttonVariants({
                      size: 'sm',
                    })}
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>

            {isUserSignedIn && (
              <div className="bg-emerald-600 border-2 border-black shadow-lg rounded-full w-10 h-10"></div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar
