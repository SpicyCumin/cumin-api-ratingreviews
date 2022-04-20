"use strict";



const formatAnswers = (questions) => {
  questions.forEach(question => {
    const answersObj = question.answers
    question.answers = Object.keys(answersObj).map(key => {
      const answer = answersObj[key]
      answer.id = key
      return answer
    })
  })
}


const formatStyles = (styles) => {
  styles.forEach(style => {
    const skusObj = style.skus
    style.skus = Object.keys(skusObj).map(key => {
      const sku = skusObj[key]
      sku.sku_id = key
      return sku
    })
  })
}

const baseApi = { details: {}, QA: {}, reviews: {}, related: [] }

const formatProductApiResponse = (apiRes, extend = false) => {
  apiRes = { ...baseApi, ...apiRes }
  const formatted = extend ? { ...apiRes } : {};
  const { details, QA, reviews, related } = apiRes;
  formatAnswers(QA.results)
  formatStyles(details.styles.results)

  formatted.product = details.product || {}
  formatted.features = details.product.features || []
  formatted.styles = details.styles.results || []
  formatted.questions = QA.results || []
  formatted.reviews = reviews.reviews.results || []
  formatted.meta = reviews.meta || {}
  formatted.related = related || []

  return formatted
}


module.exports = { formatProductApiResponse }