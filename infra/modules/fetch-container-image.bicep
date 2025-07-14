param name string
param exists bool

// This is a module that fetches the latest image for a container app
// In a real scenario, this would check if the container exists and return the appropriate image
output containers array = exists ? [
  {
    image: '${name}:latest'
  }
] : []
