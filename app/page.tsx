"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, Folder, Link, Tag, Edit, Trash2, ExternalLink, BookmarkPlus } from "lucide-react"

interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  notes: string
  tags: string[]
  folderId: string
  createdAt: Date
  favicon?: string
}

interface BookmarkFolder {
  id: string
  name: string
  color: string
  count: number
}

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    {
      id: "1",
      title: "React Dokümantasyonu",
      url: "https://react.dev",
      description: "React'in resmi dokümantasyon sitesi",
      notes: "Hooks ve component lifecycle hakkında detaylı bilgi var",
      tags: ["react", "dokümantasyon", "javascript"],
      folderId: "dev",
      createdAt: new Date("2024-01-15"),
      favicon: "/placeholder.svg?height=16&width=16",
    },
    {
      id: "2",
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      description: "Utility-first CSS framework",
      notes: "Responsive design için çok kullanışlı",
      tags: ["css", "framework", "design"],
      folderId: "dev",
      createdAt: new Date("2024-01-10"),
      favicon: "/placeholder.svg?height=16&width=16",
    },
    {
      id: "3",
      title: "Dribbble",
      url: "https://dribbble.com",
      description: "Design inspiration platform",
      notes: "UI/UX tasarım örnekleri için harika kaynak",
      tags: ["design", "inspiration", "ui"],
      folderId: "design",
      createdAt: new Date("2024-01-12"),
      favicon: "/placeholder.svg?height=16&width=16",
    },
  ])

  const [folders, setFolders] = useState<BookmarkFolder[]>([
    { id: "all", name: "Tüm Bağlantılar", color: "bg-gray-500", count: 3 },
    { id: "dev", name: "Geliştirme", color: "bg-blue-500", count: 2 },
    { id: "design", name: "Tasarım", color: "bg-purple-500", count: 1 },
    { id: "personal", name: "Kişisel", color: "bg-green-500", count: 0 },
  ])

  const [selectedFolder, setSelectedFolder] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    notes: "",
    tags: "",
    folderId: "dev",
  })

  // Get all unique tags
  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags)))

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesFolder = selectedFolder === "all" || bookmark.folderId === selectedFolder
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => bookmark.tags.includes(tag))

    return matchesFolder && matchesSearch && matchesTags
  })

  const handleAddBookmark = () => {
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: formData.title,
      url: formData.url,
      description: formData.description,
      notes: formData.notes,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      folderId: formData.folderId,
      createdAt: new Date(),
      favicon: "/placeholder.svg?height=16&width=16",
    }

    setBookmarks([...bookmarks, newBookmark])

    // Update folder count
    setFolders(
      folders.map((folder) =>
        folder.id === formData.folderId
          ? { ...folder, count: folder.count + 1 }
          : folder.id === "all"
            ? { ...folder, count: folder.count + 1 }
            : folder,
      ),
    )

    // Reset form
    setFormData({
      title: "",
      url: "",
      description: "",
      notes: "",
      tags: "",
      folderId: "dev",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      notes: bookmark.notes,
      tags: bookmark.tags.join(", "),
      folderId: bookmark.folderId,
    })
  }

  const handleUpdateBookmark = () => {
    if (!editingBookmark) return

    const updatedBookmark: Bookmark = {
      ...editingBookmark,
      title: formData.title,
      url: formData.url,
      description: formData.description,
      notes: formData.notes,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      folderId: formData.folderId,
    }

    setBookmarks(bookmarks.map((b) => (b.id === editingBookmark.id ? updatedBookmark : b)))
    setEditingBookmark(null)
    setFormData({
      title: "",
      url: "",
      description: "",
      notes: "",
      tags: "",
      folderId: "dev",
    })
  }

  const handleDeleteBookmark = (id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id)
    if (bookmark) {
      setBookmarks(bookmarks.filter((b) => b.id !== id))

      // Update folder counts
      setFolders(
        folders.map((folder) =>
          folder.id === bookmark.folderId
            ? { ...folder, count: folder.count - 1 }
            : folder.id === "all"
              ? { ...folder, count: folder.count - 1 }
              : folder,
        ),
      )
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-6">
          <BookmarkPlus className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Bağlantı Yöneticisi</h1>
        </div>

        {/* Folders */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Klasörler
          </h2>
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                  selectedFolder === folder.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${folder.color}`} />
                  <span className="text-sm">{folder.name}</span>
                </div>
                <span className="text-xs text-gray-500">{folder.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Etiketler
          </h2>
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer text-xs"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {folders.find((f) => f.id === selectedFolder)?.name || "Bağlantılar"}
            </h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Yeni Bağlantı
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Yeni Bağlantı Ekle</DialogTitle>
                  <DialogDescription>Yeni bir bookmark ekleyin ve organize edin.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Başlık</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Bağlantı başlığı"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Açıklama</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Kısa açıklama"
                    />
                  </div>
                  <div>
                    <Label htmlFor="folder">Klasör</Label>
                    <Select
                      value={formData.folderId}
                      onValueChange={(value) => setFormData({ ...formData, folderId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {folders
                          .filter((f) => f.id !== "all")
                          .map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${folder.color}`} />
                                {folder.name}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Etiketler</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="etiket1, etiket2, etiket3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notlar</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Kişisel notlarınız..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddBookmark}>Ekle</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Bağlantılarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bookmarks List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <img src={bookmark.favicon || "/placeholder.svg"} alt="" className="w-4 h-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-1 flex items-center gap-2">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition-colors truncate"
                          >
                            {bookmark.title}
                          </a>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">{bookmark.description}</CardDescription>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{bookmark.url}</span>
                          <span>•</span>
                          <span>{bookmark.createdAt.toLocaleDateString("tr-TR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => handleEditBookmark(bookmark)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {bookmark.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {bookmark.notes && (
                    <>
                      <Separator className="mb-3" />
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500">
                          <span>Notlar:</span>
                        </div>
                        <p>{bookmark.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredBookmarks.length === 0 && (
              <div className="text-center py-12">
                <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bağlantı bulunamadı</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedTags.length > 0
                    ? "Arama kriterlerinize uygun bağlantı bulunamadı."
                    : "Henüz bu klasörde bağlantı yok."}
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Bağlantınızı Ekleyin
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBookmark} onOpenChange={() => setEditingBookmark(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bağlantıyı Düzenle</DialogTitle>
            <DialogDescription>Bağlantı bilgilerini güncelleyin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Başlık</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bağlantı başlığı"
              />
            </div>
            <div>
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Açıklama</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kısa açıklama"
              />
            </div>
            <div>
              <Label htmlFor="edit-folder">Klasör</Label>
              <Select
                value={formData.folderId}
                onValueChange={(value) => setFormData({ ...formData, folderId: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {folders
                    .filter((f) => f.id !== "all")
                    .map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${folder.color}`} />
                          {folder.name}
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-tags">Etiketler</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="etiket1, etiket2, etiket3"
              />
            </div>
            <div>
              <Label htmlFor="edit-notes">Notlar</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Kişisel notlarınız..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBookmark(null)}>
              İptal
            </Button>
            <Button onClick={handleUpdateBookmark}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
