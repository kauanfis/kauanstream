import {X, Trash2, Star, Film, Tv} from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { useAllComments } from "../hooks/useComments"

interface CommentsAdminPanelProps {
  onClose: () => void
}

export function CommentsAdminPanel({ onClose }: CommentsAdminPanelProps) {
  const { allComments, loading, deleteComment } = useAllComments()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDelete = async (commentId: string) => {
    if (confirm("Tem certeza que deseja deletar este comentário?")) {
      await deleteComment(commentId)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Gerenciar Comentários</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Comments List */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
            </div>
          ) : allComments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">Nenhum comentário encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-400">
                  Total: <span className="text-white font-semibold">{allComments.length}</span>{" "}
                  comentários
                </p>
              </div>

              <AnimatePresence mode="popLayout">
                {allComments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                    className="bg-slate-800 rounded-xl p-5 space-y-3 hover:bg-slate-750 transition-colors"
                  >
                    {/* Content Type Badge */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {comment.contentType === "movie" ? (
                          <div className="flex items-center space-x-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                            <Film className="w-3 h-3" />
                            <span>Filme</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                            <Tv className="w-3 h-3" />
                            <span>Série</span>
                          </div>
                        )}
                        <span className="text-sm text-gray-400">
                          ID: {comment.contentId.substring(0, 8)}...
                        </span>
                      </div>

                      {/* Delete Button */}
                      <motion.button
                        onClick={() => handleDelete(comment._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Deletar comentário"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* User Info */}
                    <div>
                      <h4 className="font-semibold text-white">{comment.userName}</h4>
                      <p className="text-sm text-gray-400">{formatDate(comment.createdAt)}</p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= comment.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-400 ml-2">
                        {comment.rating}/5
                      </span>
                    </div>

                    {/* Comment Text */}
                    <p className="text-gray-300 leading-relaxed bg-slate-900 rounded-lg p-3">
                      {comment.comment}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
