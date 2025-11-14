import { useState } from "react"
import {Star, Trash2, User} from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useComments } from "../hooks/useComments"
import { useAuth } from "../hooks/useAuth"

interface CommentSectionProps {
  contentType: "movie" | "series"
  contentId: string
}

export function CommentSection({ contentType, contentId }: CommentSectionProps) {
  const { user, isAuthenticated, isAdmin } = useAuth()
  const { comments, loading, averageRating, addComment, deleteComment } = useComments(
    contentType,
    contentId
  )
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setSubmitting(true)
    await addComment(rating, comment)
    setComment("")
    setRating(5)
    setSubmitting(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      {comments.length > 0 && (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-semibold text-white">
            {averageRating.toFixed(1)} de 5
          </span>
          <span className="text-gray-400">({comments.length} avaliações)</span>
        </div>
      )}

      {/* Comment Form */}
      {isAuthenticated ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">Deixe sua avaliação</h3>

          {/* Star Rating Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">Sua nota:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-all ${
                      star <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-600"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <span className="text-amber-400 font-semibold ml-2">{rating}/5</span>
          </div>

          {/* Comment Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Compartilhe sua opinião..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
            required
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={submitting || !comment.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {submitting ? "Enviando..." : "Publicar Comentário"}
          </motion.button>
        </motion.form>
      ) : (
        <div className="bg-slate-800 rounded-xl p-6 text-center">
          <p className="text-gray-400">Faça login para deixar sua avaliação</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">
          Comentários ({comments.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent" />
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">Nenhum comentário ainda. Seja o primeiro!</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {comments.map((c) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-slate-800 rounded-xl p-6 space-y-3"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{c.userName}</h4>
                      <p className="text-sm text-gray-400">{formatDate(c.createdAt)}</p>
                    </div>
                  </div>

                  {/* Delete Button (Admin or Comment Owner) */}
                  {(isAdmin || user?.userId === c.userId) && (
                    <motion.button
                      onClick={() => deleteComment(c._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Deletar comentário"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>

                {/* Star Rating */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= c.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-gray-300 leading-relaxed">{c.comment}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
