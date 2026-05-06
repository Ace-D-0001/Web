<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'title' => 'Synergy Pro Workstation',
            'price' => '$2,999',
            'description' => 'The ultimate powerhouse for full-stack developers. Optimized for high-performance compilation and multi-container environments.',
            'image_url' => 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800',
            'gallery' => [
                'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400',
                'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400'
            ],
            'specs' => [
                '16-Core Ultra-Thread CPU',
                '64GB DDR5 RAM',
                '2TB Gen5 NVMe SSD',
                'Liquid Cooled Thermal System'
            ],
            'is_paused' => false,
        ]);

        Product::create([
            'title' => 'Cloud-Link Hub',
            'price' => '$450',
            'description' => 'Zero-latency synchronization between your local environment and global cloud clusters. Features hardware-level git integration.',
            'image_url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
            'gallery' => [
                'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400'
            ],
            'specs' => [
                '10Gbps Fiber-Ready',
                'Hardware Firewall',
                'Real-time DB Mirroring',
                '8x Thunderbolt 5 Ports'
            ],
            'is_paused' => false,
        ]);

        Product::create([
            'title' => 'Secure-Node v2',
            'price' => 'Contact for Quote',
            'description' => 'Hardware-level encryption for sensitive SQL databases. Requires physical biometric keys for data access.',
            'image_url' => 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
            'gallery' => [
                'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=400'
            ],
            'specs' => [
                'AES-512 Hardware Encryption',
                'Multi-Factor Biometrics',
                'Tamper-Proof Circuitry',
                'Emergency Wipe Switch'
            ],
            'is_paused' => false,
        ]);

        Product::create([
            'title' => 'Dev-Sync 5K Monitor',
            'price' => '$1,200',
            'description' => 'Crystal clear 5K resolution designed specifically for coding. Reduced blue light and ultra-wide aspect ratio for side-by-side IDEs.',
            'image_url' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
            'gallery' => [
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400'
            ],
            'specs' => [
                '5120 x 2880 Resolution',
                'TrueColor Coding Mode',
                'Built-in KVM Switch',
                '90W USB-C Power Delivery'
            ],
            'is_paused' => false,
        ]);

        Product::create([
            'title' => 'Titan-Key Mechanical Keyboard',
            'price' => '$220',
            'description' => 'Ultra-tactile mechanical keyboard with programmable macro keys and hot-swappable switches. Designed for typing efficiency.',
            'image_url' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
            'gallery' => [
                'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400'
            ],
            'specs' => [
                'Optical Linear Switches',
                'PBT Double-shot Keycaps',
                'Fully Programmable RGB',
                'Aluminum Chassis'
            ],
            'is_paused' => false,
        ]);

        Product::create([
            'title' => 'Nexus-M1 Wireless Mouse',
            'price' => '$150',
            'description' => 'Ergonomic wireless mouse with 26K DPI sensor and 100-hour battery life. Supports seamless switching between three devices.',
            'image_url' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
            'gallery' => [
                'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400'
            ],
            'specs' => [
                '26,000 DPI Optical Sensor',
                '8000Hz Polling Rate',
                'Tri-mode Connectivity',
                'Weight: 63g'
            ],
            'is_paused' => false,
        ]);

        Product::create([
            'title' => 'Pro-Link Thunderbolt Dock',
            'price' => '$350',
            'description' => 'Expand your workstation with 14 ports of connectivity. Supports dual 4K monitors and high-speed data transfer.',
            'image_url' => 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&q=80&w=800',
            'gallery' => [
                'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400'
            ],
            'specs' => [
                'Dual 4K @ 60Hz Support',
                '85W Laptop Charging',
                '10Gbps USB-C Ports',
                'SD 4.0 Card Reader'
            ],
            'is_paused' => false,
        ]);
    }
}
