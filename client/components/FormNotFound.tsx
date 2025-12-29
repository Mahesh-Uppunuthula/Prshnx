import { motion } from "framer-motion"
export function FormNotFound() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex max-w-md flex-col items-center text-center"
            >
                <div className="mb-6 flex h-40 w-40 items-center justify-center rounded-3xl bg-muted ring-1 ring-border/50">
                    {/* <FileQuestion className="h-10 w-10 text-muted-foreground/80" strokeWidth={1.5} /> */}
                    <span className="text-7xl">🌵</span>
                    {/* <span>
                        <img src="/images/page-eaten.svg" className="w-full h-full" alt="" />
                    </span> */}
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Form not found
                </h1>

                <p className="mb-8 text-base text-muted-foreground leading-relaxed">
                    The form you are looking for doesn't exist or has been deleted.
                    Please check the link and try again.
                </p>
                {/* 
                <Button asChild size="lg" className="rounded-full px-8 font-medium">
                    <Link to="/">
                        <ArrowLeft /> Return Home
                    </Link>
                </Button> */}
            </motion.div>
        </div>
    )
}
