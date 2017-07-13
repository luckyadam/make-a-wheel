/**
 * @author luckyadam
 * @date 2017-7-13
 * @desc createelement
 */

const Header = require('../../../gb/widget/header/header')
const Footer = require('../../../gb/widget/footer/footer')

class Createelement extends Nerv.Component {
  constructor () {
    super(...arguments)
    this.state = {}
  }

  render () {
    return (
      <div className='createelement'>
        <Header isHome={false} />
        <Footer />
      </div>
    )
  }
}

Nerv.render(<Createelement />, document.getElementById('J_container'))
