export interface Song {
    audioUrl: string;
    id: string;
    title: string;
    artist: string;
    cover: string;
    file: string;
    duration: number;
  }
  
  export const songs: Song[] = [
    {
      id: "1",
      title: "Kanmoodi",
      artist: "Artist Name",
      cover: "/songs/covers/kanmoodi-cover.jpeg", // Update with your cover path
      file: "/songs/Kanmoodi.mp3", // This path should be relative to the public directory
      duration: 180 // Update with actual duration in seconds
      ,
      audioUrl: ""
    },
    {
      id: "2",
      title: "Marco-Blood",
      artist: "Artist Two",
      cover: "/songs/covers/Blood.jpeg",
      file: "/songs/Blood.mp3",
      duration: 210,
      audioUrl: ""
    },
    {
      id: "3",
      title: "Kochadaiyaan",
      artist: "Artist Name",
      cover: "/songs/covers/kochadaiyan.jpeg", // Update with your cover path
      file: "/songs/Maattram-Ondrudhaan-Maaraadhadhu.mp3", // This path should be relative to the public directory
      duration: 180 // Update with actual duration in seconds
      ,
      audioUrl: ""
    },
    // Add more songs as needed
  ];