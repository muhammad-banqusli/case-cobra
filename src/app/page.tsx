import {
    Hero,
    CustomerTestimonials,
    CTA,
    
} from "@/components";


export default function Home() {
    return (
        <div className="bg-slate-50 grainy-light">
            <Hero />
            <CustomerTestimonials />
            <CTA />
        </div>
    );
}
