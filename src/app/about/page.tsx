export default function About() {
    return(
        <div>
            <h1 className="m-5 text-2xl font-bold text-center">About This Project</h1>
            <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">Why Film Development?</h3>
            <p className="mx-10 w-1/2">
                I'm passionate about the creative process in general. Whether it's software, art, baked goods, 
                or anything else, I love the magic of transformation—turning ideas into reality. 
                Film development has a special kind of charm compared to the digital form: the process of 
                capturing moments and revealing them in silver halide is enchanting. Once you experience it, you're hooked.
            </p>
            <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">Another Darkroom Clock?</h3>
            <p className="mx-10 w-1/2">
                While there are several darkroom clock apps available, none quite fit my needs. 
                I've been using my phone's stopwatch for timing and a notepad for recipes, constantly 
                switching between tools. This inspired me to create a unified solution that works for 
                me—and hopefully for others, too.
            </p>
            <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">Who Am I?</h3>
            <p className="mx-10 w-1/2">
                I'm a creative and curious individual who uses software development to solve practical 
                problems, craft useful tools, and build fun and enjoyable experiences. You can find some 
                of my other projects in
                 <a className="text-blue-600" href="https://github.com/henriquegavabarreto" target="_blank"> my github</a>.
            </p>
            <h3 className="mx-10 mb-5 mt-10 text-xl font-semibold">How Was This Made?</h3>
            <p className="mx-10 w-1/2">
                This web app was built using TypeScript, Next.js, Tailwind CSS, and Firebase.
            </p>
        </div>
    );
}