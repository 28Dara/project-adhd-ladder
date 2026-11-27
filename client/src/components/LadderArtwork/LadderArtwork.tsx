import ladderIllustration from '../../images/ladder-illustration.webp'
import mobileIllustration from '../../images/tab-cel-illustration.webp'
import './LadderArtwork.css'

export default function LadderArtwork() {
  return (
    <picture className="ladder-artwork">
      <source
        media="(min-width: 64rem)"
        srcSet={ladderIllustration}
        width={966}
        height={1445}
      />
      <img
        src={mobileIllustration}
        alt=""
        width={2088}
        height={2048}
        loading="lazy"
      />
    </picture>
  )
}
