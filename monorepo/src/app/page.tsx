'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Sparkles, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Star,
  Play,
  Award,
  Globe,
  Clock,
  MessageCircle,
  Mail,
  Phone,
  Building2,
  Rocket,
  Target,
  BarChart3,
  Layers,
  Lock,
  Smartphone,
  Bot
} from "lucide-react";
import { RotatingGlobe } from '@/utils/rotatingGlobe';

import { stats, features, testimonials, partners , aiChatbots, coinFeatures} from "@/utils/constants/landingPageConstants";
import Link from 'next/link';


export default function EnhancedLandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden">
    
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-gray-100/20 to-transparent dark:from-gray-900/20 rotate-12 transform" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-gray-100/20 to-transparent dark:from-gray-900/20 -rotate-12 transform" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 animate-pulse">
              <Rocket className="w-4 h-4 mr-2" />
              Tokenise digital assets and experiences using AI and Zora protocol 
            </Badge>
            <RotatingGlobe />
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Tokenise 
              <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100 bg-clip-text text-transparent animate-pulse">
                Everything and Anything
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              Tokonomy revolutionizes token creation through AI-powered automation, offering three specialized chatbots that transform everything from detailed specifications to spontaneous rants into ready-to-mint coins on the Zora protocol. Whether you need precise control with Tokebot Sonnet, emotional expression through Tokebot Mood, or viral optimization via Tokebot Prompt, our platform delivers predictive success analysis and seamless deployment while connecting creators through profile exploration and trending coin discovery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group"
              >
                <Link href="https://docs.zora.co/" target="_blank">
                Check Zora Protocol docs 
                </Link>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-300 dark:border-gray-700 px-8 py-4 text-lg hover:bg-gray-50 dark:hover:bg-gray-900 group backdrop-blur-sm"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-black dark:text-white mb-1 group-hover:scale-105 transition-transform">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {/* Partners Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-gray-300 dark:border-gray-700">
              <Building2 className="w-4 h-4 mr-2" />
              Trusted Partners
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We collaborate with the world's most innovative companies to deliver exceptional experiences.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {partners.map((partner, index) => (
                <div key={index} className="flex flex-col items-center group text-center">
                  <div className="w-full h-16 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-300 hover:scale-105 group-hover:border-gray-400 dark:group-hover:border-gray-600">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                      {partner.logo}
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {partner.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gray-300 dark:border-gray-700">
              <Target className="w-4 h-4 mr-2" />
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Powerful features designed to help you work smarter, not harder. Built for the modern global workforce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-50/50 dark:from-gray-900/50 dark:to-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chatbots Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gray-300 dark:border-gray-700">
              <Bot className="w-4 h-4 mr-2" />
              AI Chatbots
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Intelligent Coin Creation Assistants
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Choose from our AI-powered chatbots to create, analyze, and optimize your coins with different approaches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aiChatbots.map((bot, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${bot.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardHeader className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${bot.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    {bot.icon}
                  </div>
                  <Badge variant="secondary" className="w-fit mb-2 text-xs">
                    {bot.type}
                  </Badge>
                  <CardTitle className="text-2xl mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">{bot.name}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {bot.description}
                  </CardDescription>
                  <div className="space-y-2 mb-6">
                    {bot.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button className={`w-full bg-gradient-to-r ${bot.color} text-white border-0 hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                   <Link href={bot.url} target="_blank" rel="noopener noreferrer">
                    Try {bot.name}
                   </Link>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coin Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gray-300 dark:border-gray-700">
              <Zap className="w-4 h-4 mr-2" />
              Coin Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Every coin created with our platform comes with powerful features designed to maximize your success potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coinFeatures.map((feature, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-2xl transition-all duration-500 hover:scale-105 group text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300 mx-auto group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-black dark:group-hover:text-white transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gray-300 dark:border-gray-700">
              <Users className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              See what our customers have to say about their transformative experience with our global platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 dark:text-gray-300 text-base leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center font-semibold text-sm group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-black dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-gray-300 dark:border-gray-700">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your workflow? Contact our team through your preferred channel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 mx-auto">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl mb-2">Discord</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Join our community for real-time support and discussions</p>
                <Button variant="outline" className="w-full hover:bg-blue-50 dark:hover:bg-blue-950 group-hover:border-blue-500 transition-all duration-300">
                  Join Discord
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl mb-2">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Send us a message and we'll respond within 24 hours</p>
                <Button variant="outline" className="w-full hover:bg-green-50 dark:hover:bg-green-950 group-hover:border-green-500 transition-all duration-300">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 mx-auto">
                  <Phone className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl mb-2">Telegram</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Connect with us instantly for quick questions and support</p>
                <Button variant="outline" className="w-full hover:bg-purple-50 dark:hover:bg-purple-950 group-hover:border-purple-500 transition-all duration-300">
                  Open Telegram
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Global Workflow?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Join thousands of teams worldwide who have already revolutionized their productivity. 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group"
            >
              Backed by Zora
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-300 dark:border-gray-700 px-8 py-4 text-lg hover:bg-gray-50 dark:hover:bg-gray-900 group"
            >
              <MessageCircle className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white dark:text-black" />
                </div>
                <span className="text-xl font-bold">Tokonomy</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md leading-relaxed mb-6">
                Empowering global teams to achieve more through intelligent workflow automation and seamless collaboration across continents.
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Discord
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-green-50 dark:hover:bg-green-950">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-purple-50 dark:hover:bg-purple-950">
                  <Phone className="w-4 h-4 mr-2" />
                  Telegram
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              <p>&copy; 2025 Tokonomy. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Globe className="w-4 h-4" />
              <span className="text-sm">Serving teams in 120+ countries</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}