/**
 * @author luckyadam
 * @date 2017-7-6
 * @desc 样例0
 */

class LikeButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = { liked: false }
  }

  handleClick = () => {
    this.setState({ liked: !this.state.liked })
  }

  render () {
    const text = this.state.liked ? '爱' : '不爱'
    return (
      <p onClick={this.handleClick} style={{cursor: 'pointer'}}>
        你<span style={{color: 'red'}}>{text}</span>我
      </p>
    );
  }
}

ReactDOM.render(<LikeButton />, document.getElementById('app'))
