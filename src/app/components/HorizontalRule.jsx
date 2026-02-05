import React from 'react'

function HorizontalRule({borderColor = "border-secondary"}) {
  return (
    <hr className={`my-8 border-t-2 ${borderColor}`} />
  )
}

export default HorizontalRule