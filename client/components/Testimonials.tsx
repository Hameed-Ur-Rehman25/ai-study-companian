import { Star } from 'lucide-react';
import { MotionWrapper } from './ui/MotionWrapper';

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Medical Student",
        image: "https://i.pravatar.cc/150?u=sarah",
        content: "The PDF-to-Video feature is a lifesaver for anatomy. I convert my textbooks into lectures I can watch on the commute. Truly a game changer!",
        rating: 5
    },
    {
        name: "James Wilson",
        role: "Law Student",
        image: "https://i.pravatar.cc/150?u=james",
        content: "Summarizing case studies used to take hours. Now I get the key precedents in seconds. It's like having a 24/7 study buddy.",
        rating: 5
    },
    {
        name: "Emily Rodriguez",
        role: "Researcher",
        image: "https://i.pravatar.cc/150?u=emily",
        content: "The semantic search is incredibly accurate. It finds connections in my research papers that I might have missed.",
        rating: 5
    }
];

export function Testimonials() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Loved by Learners Worldwide
                    </h2>
                    <p className="text-lg text-gray-600">Join thousands of students achieving their academic goals.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <MotionWrapper
                            key={index}
                            as="div"
                            className="bg-gray-50 p-8 rounded-2xl relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="flex gap-1 mb-4 text-yellow-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        </MotionWrapper>
                    ))}
                </div>
            </div>
        </section>
    );
}
