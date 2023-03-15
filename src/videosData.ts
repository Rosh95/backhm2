export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}

export let videoData: VideoType[] = [{
    id: 0,
    title: 'Green Mile',
    author: 'Robert Zemekis',
    canBeDownloaded: false,
    minAgeRestriction: 12,
    createdAt: "2023-03-05T18:30:22.708Z",
    publicationDate: "2023-03-05T18:30:22.708Z",
    availableResolutions: ["P1440"]
}, {
    id: 1,
    title: '1984',
    author: 'Robert Levandovski',
    canBeDownloaded: false,
    minAgeRestriction: 12,
    createdAt: "2023-03-05T18:30:22.708Z",
    publicationDate: "2023-03-05T18:30:22.708Z",
    availableResolutions: ["P1440"]
}]