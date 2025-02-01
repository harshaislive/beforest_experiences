export default function EventLoading() {
    return (
        <main className="min-h-screen bg-sage-50">
            {/* Hero Section Loading */}
            <section className="relative h-[80vh] min-h-[600px] bg-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
                        <div className="max-w-4xl">
                            {/* Location */}
                            <div className="h-6 w-32 bg-white/20 rounded mb-4" />
                            
                            {/* Title */}
                            <div className="h-12 w-3/4 bg-white/20 rounded mb-6" />
                            
                            {/* Description */}
                            <div className="h-20 w-full bg-white/20 rounded mb-8" />
                            
                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="h-16 w-48 bg-white/20 rounded" />
                                <div className="h-16 w-48 bg-white/20 rounded" />
                            </div>
                            
                            {/* CTA Button */}
                            <div className="h-14 w-40 bg-white/20 rounded" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section Loading */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* About Section */}
                                <div className="bg-white rounded-xl p-8 shadow-sm">
                                    <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-gray-200 rounded" />
                                        <div className="h-4 w-5/6 bg-gray-200 rounded" />
                                        <div className="h-4 w-4/6 bg-gray-200 rounded" />
                                    </div>
                                </div>

                                {/* Schedule Section */}
                                <div className="bg-white rounded-xl p-8 shadow-sm">
                                    <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
                                    <div className="space-y-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 bg-gray-100 rounded-lg">
                                                <div className="h-6 w-6 bg-gray-200 rounded" />
                                                <div className="flex-1">
                                                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                                                    <div className="h-4 w-48 bg-gray-200 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl p-8 shadow-sm">
                                    <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
                                    <div className="space-y-6">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className="h-6 w-6 bg-gray-200 rounded" />
                                                <div className="flex-1">
                                                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                                                    <div className="h-4 w-48 bg-gray-200 rounded" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
