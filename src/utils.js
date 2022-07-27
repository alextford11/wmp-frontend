import {FormErrorMessage} from './components/FormWidgets';
import {renderToStaticMarkup} from 'react-dom/server'

export async function handleErrors(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson && await response.json()

  if (!response.ok) {
    const error = data.detail || response.status
    return Promise.reject(error)
  }
  return data
}

function removePreviousErrors(form) {
  for (const elem of form.querySelectorAll('.form-error-message')) {
    elem.remove()
  }

  for (const elem of form.querySelectorAll('.field-error-text')) {
    elem.remove()
  }
}


function handleFormError(error, form) {
  const errorMessage = FormErrorMessage({error: error})
  const element = document.createElement('div')
  element.setAttribute('class', 'form-error-message')
  element.innerHTML = renderToStaticMarkup(errorMessage)
  form.prepend(element)
}


function handleFieldErrors(errors, form) {
  for (const error of errors) {
    const fieldName = error.loc[1]
    const fieldId = '#id_' + fieldName
    const fieldElem = form.querySelector(fieldId)
    if (!fieldElem) {
      return
    }

    const fieldErrorText = `<div class="field-error-text"><p>${error.msg}</p></div>`
    fieldElem.parentNode.insertAdjacentHTML('beforeend', fieldErrorText)
  }
}


export function handleErrorMessage(error, form) {
  removePreviousErrors(form)
  if (typeof error === 'string') {
    handleFormError(error, form)
  } else {
    handleFieldErrors(error, form)
  }
}
