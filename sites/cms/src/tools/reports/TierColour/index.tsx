import './styles.scss'

export function PriceTierColour({ colour }: { colour?: string }) {
  return colour ? <div className="tier-colour" style={{ background: colour }} /> : <></>
}
