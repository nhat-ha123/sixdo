

// export const metadata = {
//     title: 'Tiktok Page',
//     description: 'This is contyent of Tiktok page',
// }

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}
