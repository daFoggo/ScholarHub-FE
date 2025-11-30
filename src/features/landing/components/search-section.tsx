import AnimatedContent from "@/components/decoration/animate-content"
import FadeContent from "@/components/decoration/fade-content"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { MoveRight } from "lucide-react"
import { useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { SEARCHING_STEP } from "../utils/constant"

export const SearchSection = () => {
    const [activeStep, setActiveStep] = useState<number>(1)
    const navigate = useNavigate()

    return (
        <div id="features" className="bg-muted w-full">
            <div className="flex flex-col items-center gap-4 sm:gap-6 py-8 sm:py-12 md:py-16 container-wrapper">
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
                    <div className="container">
                        <p className="mb-2 sm:mb-4 font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center">
                            A brand-new scholarship searching experience
                        </p>
                        <p className="mx-auto max-w-3xl font-bricolage text-muted-foreground text-sm sm:text-base md:text-lg text-center">
                            Our smart, adaptive searching algorithm breaks down language barriers, helping you find scholarship
                            opportunities that truly fit your unique profile.
                        </p>
                    </div>
                </AnimatedContent>

                <FadeContent
                    blur={true}
                    duration={1000}
                    easing="ease-out"
                    initialOpacity={0}
                    className="mt-4 sm:mt-6 md:mt-8 container"
                >
                    <div className="bg-background shadow-md sm:shadow-lg rounded-lg overflow-hidden">
                        <div className="flex flex-col md:gap-0 md:grid md:grid-cols-2">
                            {/* Mobile step selector */}
                            <div className="md:hidden flex gap-2 p-4 border-b overflow-x-auto scrollbar-hide">
                                {SEARCHING_STEP.map((step) => (
                                    <button
                                        key={`mobile-${step.id}`}
                                        onClick={() => setActiveStep(step.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors",
                                            activeStep === step.id
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-primary/10 text-primary hover:bg-primary/20",
                                        )}
                                    >
                                        <step.icon className="size-3.5" />
                                        <span>Step {step.id}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Image section for mobile */}
                            <div className="md:hidden relative h-[200px] sm:h-[225px]">
                                {SEARCHING_STEP.map((step) => (
                                    <div
                                        key={`mobile-img-${step.id}`}
                                        className={cn(
                                            "absolute inset-0 p-4 transition-opacity duration-500",
                                            activeStep === step.id ? "opacity-100" : "opacity-0 pointer-events-none",
                                        )}
                                    >
                                        <LazyLoadImage
                                            src={step.image.light || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="dark:hidden w-full h-full object-contain"
                                        />
                                        <LazyLoadImage
                                            src={step.image.dark || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="hidden dark:block w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Steps content */}
                            <div className="flex flex-col justify-center gap-2 p-4 sm:p-6 md:p-8">
                                {SEARCHING_STEP.map((step) => (
                                    <div
                                        key={step.id}
                                        onClick={() => setActiveStep(step.id)}
                                        className={cn(
                                            "space-y-2 p-2 transition-all duration-300 cursor-pointer",
                                            activeStep === step.id
                                                ? "bg-primary/5 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-lg"
                                                : "hover:bg-primary/5 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-lg",
                                            activeStep !== step.id && "hidden md:block",
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex justify-center items-center bg-primary/10 rounded-full size-6 sm:size-8 text-primary">
                                                <step.icon className="size-3 sm:size-4" />
                                            </div>
                                            <span className="font-medium text-primary text-sm sm:text-base md:text-lg">Step {step.id}</span>
                                        </div>

                                        <p className="font-semibold text-lg sm:text-xl md:text-2xl">{step.title}</p>
                                        <p className="text-muted-foreground text-sm sm:text-base">{step.description}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Image section for desktop  */}
                            <div className="hidden md:block relative md:min-h-[400px] lg:min-h-[450px] aspect-[16/9] md:aspect-auto overflow-hidden">
                                {SEARCHING_STEP.map((step) => (
                                    <div
                                        key={`desktop-img-${step.id}`}
                                        className={cn(
                                            "absolute inset-0 p-4 transition-opacity duration-500",
                                            activeStep === step.id ? "opacity-100" : "opacity-0 pointer-events-none",
                                        )}
                                    >
                                        <LazyLoadImage
                                            src={step.image.light || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="dark:hidden rounded-lg w-full h-full object-contain"
                                        />
                                        <LazyLoadImage
                                            src={step.image.dark || "/placeholder.svg"}
                                            alt={`Illustration for ${step.title}`}
                                            className="hidden dark:block w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </FadeContent>

                <AnimatedContent
                    distance={50}
                    delay={300}
                    direction="vertical"
                    reverse={false}
                    transition={{ type: "spring", stiffness: 100, damping: 30 }}
                    initialOpacity={0}
                    animateOpacity
                    threshold={0.2}
                >
                    <Button
                        className="shadow-md sm:shadow-lg mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-2.5 text-base sm:text-lg"
                        onClick={() => navigate({ to: "/scholarship-search" })}
                    >
                        Try it yourself!
                        <MoveRight className="size-4 sm:size-5 md:size-6" />
                    </Button>
                </AnimatedContent>
            </div>
        </div>
    )
}
