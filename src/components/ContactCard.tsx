import React from 'react'

export default function ContactCard({text="Contact"}) {
  return (
    <div>
        <p>{text}</p>
        <div className='flex'></div>
    </div>
  )
}
