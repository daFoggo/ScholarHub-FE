import AnimatedContent from "@/components/decoration/animate-content"
import FadeContent from "@/components/decoration/fade-content"
import { LazyLoadImage } from "react-lazy-load-image-component"
import updatesImg from "@/assets/images/landing/updates_image.png"
import updatesImgDark from "@/assets/images/landing/updates_image_dark.png"

export const LatestInformationSection = () => {
    return (
        <div
            id="latest-information"
            className="w-full bg-muted py-8 sm:py-12 md:py-16 px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6"
        >
            <AnimatedContent
                distance={50}
                delay={0.15}
                direction="vertical"
                reverse={false}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
                initialOpacity={0}
                animateOpacity
                threshold={0.2}
            >
                <div>
                    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-2 sm:mb-4">
                        Official Scholarship Updates & University Partnerships
                    </p>
                    <p className="text-sm sm:text-base md:text-lg font-bricolage text-center text-muted-foreground max-w-3xl mx-auto px-2">
                        We provide up-to-date scholarships while universities join to share opportunities,
                        <span className="hidden sm:inline">
                            <br />
                        </span>{" "}
                        connect with students, and promote their programs.
                    </p>
                </div>
            </AnimatedContent>

            <FadeContent
                blur={true}
                duration={1000}
                easing="ease-out"
                initialOpacity={0}
                className="w-full mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4 md:px-6"
            >
                <div className="max-w-4xl mx-auto">
                    <LazyLoadImage
                        src={updatesImg}
                        alt={"Illustration for latest information section"}
                        className="w-full h-auto rounded-lg object-contain block dark:hidden"
                    />
                    <LazyLoadImage
                        src={updatesImgDark}
                        alt={"Illustration for latest information section"}
                        className="w-full h-auto rounded-lg object-contain hidden dark:block"
                    />
                </div>
            </FadeContent>
        </div>
    )
}
