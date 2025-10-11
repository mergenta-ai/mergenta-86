import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '375px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1400px',
		},
		extend: {
			spacing: {
				'xs': 'var(--space-xs)',
				'sm': 'var(--space-sm)',
				'md': 'var(--space-md)',
				'lg': 'var(--space-lg)',
				'xl': 'var(--space-xl)',
				'2xl': 'var(--space-2xl)',
				'3xl': 'var(--space-3xl)',
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				mergenta: {
					primary: 'hsl(var(--mergenta-primary))',
					secondary: 'hsl(var(--mergenta-secondary))',
					light: 'hsl(var(--mergenta-light))',
					glow: 'hsl(var(--mergenta-glow))'
				},
				"mergenta-violet": "hsl(var(--mergenta-violet))",
				"mergenta-magenta": "hsl(var(--mergenta-magenta))",
				"mergenta-fuchsia": "hsl(var(--mergenta-fuchsia))",
				"mergenta-deep-violet": "hsl(var(--mergenta-deep-violet))",
				"mergenta-dark-grey": "hsl(var(--mergenta-dark-grey))",
				"mergenta-light-violet": "hsl(var(--mergenta-light-violet))",
				"mergenta-soft-pink": "hsl(var(--mergenta-soft-pink))",
				"pastel-magenta": "hsl(var(--pastel-magenta))",
				"pastel-magenta-hover": "hsl(var(--pastel-magenta-hover))",
				"pastel-violet": "hsl(var(--pastel-violet))",
				"pastel-violet-hover": "hsl(var(--pastel-violet-hover))",
				"pastel-lavender": "hsl(var(--pastel-lavender))",
				"pastel-lavender-hover": "hsl(var(--pastel-lavender-hover))",
				"pastel-rose-lilac": "hsl(var(--pastel-rose-lilac))",
				"sidebar-text-dark": "hsl(var(--sidebar-text-dark))",
				"sidebar-text-violet": "hsl(var(--sidebar-text-violet))",
				"sidebar-icon-default": "hsl(var(--sidebar-icon-default))",
				"sidebar-icon-hover": "hsl(var(--sidebar-icon-hover))",
				'chat-bg': 'hsl(var(--chat-bg))',
				'message-user': 'hsl(var(--message-user))',
				'message-ai': 'hsl(var(--message-ai))'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-background': 'var(--gradient-background)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-accent': 'var(--gradient-accent)'
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'glow': 'var(--shadow-glow)',
				'soft': 'var(--shadow-soft)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)'
			},
			fontSize: {
				'xs': ['var(--font-size-xs)', { lineHeight: '1.4' }],
				'sm': ['var(--font-size-sm)', { lineHeight: '1.5' }],
				'base': ['var(--font-size-base)', { lineHeight: '1.6' }],
				'lg': ['var(--font-size-lg)', { lineHeight: '1.5' }],
				'xl': ['var(--font-size-xl)', { lineHeight: '1.4' }],
				'2xl': ['var(--font-size-2xl)', { lineHeight: '1.3' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'var(--radius-sm)',
				sm: 'calc(var(--radius-sm) - 2px)',
				xl: 'var(--radius-lg)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'slide-out-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
