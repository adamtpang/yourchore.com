import { Link } from 'react-router-dom'
import {
    ClockIcon,
    CurrencyDollarIcon,
    ShieldCheckIcon,
    SparklesIcon,
    TruckIcon,
    WifiIcon
} from '@heroicons/react/24/outline'

const features = [
    {
        name: 'Quick Service',
        description: '24-hour turnaround for regular service, 12-hour for express',
        icon: ClockIcon,
    },
    {
        name: 'Professional Care',
        description: 'Expert handling of all fabric types with premium detergents',
        icon: SparklesIcon,
    },
    {
        name: 'Secure Payments',
        description: 'Multiple payment options including card and crypto',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Real-time Updates',
        description: 'Track your laundry status in real-time through our dashboard',
        icon: WifiIcon,
    },
    {
        name: 'Free Pickup',
        description: 'Complimentary pickup and delivery to your room',
        icon: TruckIcon,
    },
    {
        name: 'Fair Pricing',
        description: 'Transparent pricing with no hidden fees',
        icon: CurrencyDollarIcon,
    },
]

const Home = () => {
    return (
        <div className="animate-enter">
            {/* Hero Section */}
            <div className="relative isolate overflow-hidden">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-200 to-primary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>

                <div className="mx-auto max-w-4xl py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            <span className="block">Leave your laundry.</span>
                            <span className="block mt-2">Press a button.</span>
                            <span className="block mt-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                Get it back clean.
                            </span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                            Experience hassle-free laundry service at your fingertips. We'll take care of your clothes while you focus on what matters most.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                to="/order"
                                className="btn btn-primary text-lg px-8 py-3 shadow-sm"
                            >
                                Do My Laundry
                            </Link>
                            <Link
                                to="/dashboard"
                                className="btn btn-outline text-lg"
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 sm:py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need for clean clothes
                        </h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Professional laundry service that makes your life easier. Just drop off your clothes and we'll handle the rest.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature) => (
                                <div key={feature.name} className="card hover:shadow-lg transition-shadow duration-300">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </div>
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-1 text-base leading-7 text-gray-600">
                                        {feature.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home