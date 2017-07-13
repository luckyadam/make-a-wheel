import { updateComponent } from './lifecycle'

function reRenderComponent (prev, curr) {
  const nextProps = curr.props
  if (prev.componentWillReceiveProps) {
    prev.componentWillReceiveProps(nextProps)
  }
  prev.props = nextProps
  updateComponent(prev)
  return prev.dom
}

module.exports = reRenderComponent
