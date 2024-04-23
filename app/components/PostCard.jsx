const assetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL

export default function PostCard({ image, title, body }) {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
        <img className="w-full" src={`${assetsUrl}/${image}`} alt="Sunset in the mountains" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">
            {body}
          </p>
        </div>
      </div>
    )
}