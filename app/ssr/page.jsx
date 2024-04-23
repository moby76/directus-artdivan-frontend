const page = ({ quotes }) => {
    console.log(quotes)
  return (
    <div>
        <h4>Use serverSideProps() </h4>
    </div>
  )
}

export default page

// export const getServerSideProps = async () => {
//     const data = await fetch("https://dummyjson.com/quotes")
//     const qdata = await data.json()
//     const quotes = qdata.quotes

//     return {props: {quotes}}
// }