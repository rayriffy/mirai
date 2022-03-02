export const getPamuseUrl = () => {
  const sus = Math.floor(Math.random() * 1000000) % 69 === 0
  return sus ? '/static/pamong.svg' : '/static/pamuse.svg'
}
