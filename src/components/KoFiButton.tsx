interface KoFiButtonProps {
  kofiId: string
}

export function KoFiButton({ kofiId }: KoFiButtonProps) {
  return (
    <a
      href={`https://ko-fi.com/${kofiId}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        marginTop: '1rem',
      }}
    >
      <img
        src="/support_me_on_kofi_beige.png"
        alt="Support me on Ko-fi"
        style={{
          width: '150px',
          height: 'auto',
        }}
      />
    </a>
  )
}
