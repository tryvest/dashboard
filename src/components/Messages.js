import React from 'react';
import WidgetBot, { /*API*/ } from '@widgetbot/react-embed'

function Messages() {
  {/*const api = API

  const onAPI = () => {
    api.on('signIn', user => {
      console.log(`Signed in as ${user.name}`, user)
    })
  }

  const handleClick = () => {
    api.emit(
        'sendMessage',
        `Hello world! from \`@widgetbot/react-embed\`\n` +
        `<>`
    )
  }
  */}
  return (
      <div>
        {/*<button onClick={handleClick.bind(this)}>
          {`Send "Hello world"`}
        </button>*/}
        <WidgetBot
            server="976275966366212228"
            channel="976275966366212233"
            //onAPI={onAPI.bind(this)}
            height={300}
            width={500}
        />

      </div>
  )
}

export default Messages