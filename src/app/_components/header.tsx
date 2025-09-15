"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Header = () => {
	const pathname = usePathname()

	return (
		<header className="w-full h-16 flex items-center justify-center gap-24 bg-slate-600/20">
			<h1>CRUD con SWR</h1>
			<Link href="/" className={pathname === "/" ? "font-bold underline" : ""}>
				Todos
			</Link>
			<Link
				href="/mongo"
				className={pathname === "/mongo" ? "font-bold underline" : ""}
			>
				Mongo
			</Link>
		</header>
	)
}
