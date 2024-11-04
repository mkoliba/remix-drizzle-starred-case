import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

// Sample data for demonstration
const sampleResults = [
  { id: 1, title: "First Result", description: "This is the first search result" },
  { id: 2, title: "Second Result", description: "This is the second search result" },
  { id: 3, title: "Third Result", description: "This is the third search result" },
]

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState(sampleResults)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    // Filter results based on the search query
    const filteredResults = sampleResults.filter(
      result => result.title.toLowerCase().includes(query.toLowerCase()) ||
                result.description.toLowerCase().includes(query.toLowerCase())
    )
    setSearchResults(filteredResults)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with user menu */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Search App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">John Doe</span>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Search bar */}
          <div className="mb-6">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full"
            />
          </div>

          {/* Search results */}
          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <CardTitle>{result.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}