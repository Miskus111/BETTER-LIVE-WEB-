import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="eyebrow">404</p>
      <h1 className="display mt-3 text-[52px]">Nothing at this address.</h1>
      <p className="text-muted mt-3">
        The organ, food or product you were looking for doesn&rsquo;t exist here.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn btn-primary">
          Back to the body
        </Link>
        <Link href="/shop" className="btn btn-ghost">
          Shop
        </Link>
      </div>
    </div>
  )
}
