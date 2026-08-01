"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
export const ContainerScroll = ({
 titleComponent,
 children,
}: {
 titleComponent: string | React.ReactNode;
 children: React.ReactNode;
}) => {
 const containerRef = useRef<HTMLDivElement>(null);
 const { scrollYProgress } = useScroll({
 target: containerRef,
 });
 const [isMobile, setIsMobile] = React.useState(false);
 React.useEffect(() => {
 const checkMobile = () => {
 setIsMobile(window.innerWidth <= 768);
 };
 checkMobile();
 window.addEventListener("resize", checkMobile);
 return () => {
 window.removeEventListener("resize", checkMobile);
 };
 }, []);
 const scaleDimensions = () => {
 return isMobile ? [0.7, 0.9] : [1.05, 1];
 };
 const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
 const rotateY = useTransform(scrollYProgress, [0, 1], [-25, 0]);
 const rotateZ = useTransform(scrollYProgress, [0, 1], [10, 0]);
 const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
 const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);
 return (
 <div
 className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
 ref={containerRef}
 >
 <div
 className="py-10 md:py-40 w-full relative"
 style={{
 perspective: "1000px",
 }}
 >
 <Header translate={translate} titleComponent={titleComponent} />
 <Card rotateX={rotateX} rotateY={rotateY} rotateZ={rotateZ} translate={translate} scale={scale}>
 {children}
 </Card>
 </div>
 </div>
 );
};
export const Header = ({ translate, titleComponent }: any) => {
 return (
 <motion.div
 style={{
 translateY: translate,
 }}
 className="div max-w-5xl mx-auto text-center"
 >
 {titleComponent}
 </motion.div>
 );
};
export const Card = ({
 rotateX,
 rotateY,
 rotateZ,
 scale,
 children,
}: {
 rotateX: MotionValue<number>;
 rotateY: MotionValue<number>;
 rotateZ: MotionValue<number>;
 scale: MotionValue<number>;
 translate: MotionValue<number>;
 children: React.ReactNode;
}) => {
 return (
 <motion.div
 style={{
 rotateX,
 rotateY,
 rotateZ,
 scale,
 boxShadow:
 "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
 }}
 className="max-w-md md:max-w-3xl -mt-12 mx-auto aspect-square w-full border border-white/10 p-1 md:p-2 bg-black rounded-[30px] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
 >
 <div className="h-full w-full overflow-hidden rounded-[24px] bg-black">
 {children}
 </div>
 </motion.div>
 );
};

