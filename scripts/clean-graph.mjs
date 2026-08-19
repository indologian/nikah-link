#!/usr/bin/env node
// scripts/clean-graph.mjs (Fixed Version)
// Membersihkan graph.json dari duplikasi node, community, dan filter noise

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const GRAPH_PATH = join(process.cwd(), 'graphify-out', 'graph.json');

// Identifier trivial yang harus di-exclude
const TRIVIAL_PATTERNS = [
    /^\$schema$/,
    /^name$/,
    /^baseURL$/,
    /^apiKey$/,
    /^auto$/,
    /^auto\/cheap$/,
    /^auto\/coding$/,
    /^dom$/,
    /^dom\.iterable$/,
    /^esnext$/,
];

function isTrivial(label) {
    return TRIVIAL_PATTERNS.some(p => p.test(label));
}

function main() {
    console.log('📖 Membaca graph.json...');
    const raw = readFileSync(GRAPH_PATH, 'utf-8');
    const graph = JSON.parse(raw);

    // Debug: tampilkan struktur top-level
    console.log('🔍 Struktur graph.json:');
    console.log('   Top-level keys:', Object.keys(graph));

    if (graph.graph) {
        console.log('   graph.graph keys:', Object.keys(graph.graph));
    }

    // === DETEKSI LOKASI EDGES ===
    // Coba beberapa lokasi yang umum di format networkx/graphify
    let edgesArray = null;
    let edgesLocation = '';

    // Coba graph.links (format d3/networkx node_link_data)
    if (graph.links && Array.isArray(graph.links)) {
        edgesArray = graph.links;
        edgesLocation = 'graph.links';
    }
    // Coba graph.edges (format lain)
    else if (graph.edges && Array.isArray(graph.edges)) {
        edgesArray = graph.edges;
        edgesLocation = 'graph.edges';
    }
    // Coba graph.graph.links
    else if (graph.graph?.links && Array.isArray(graph.graph.links)) {
        edgesArray = graph.graph.links;
        edgesLocation = 'graph.graph.links';
    }
    // Coba graph.graph.edges
    else if (graph.graph?.edges && Array.isArray(graph.graph.edges)) {
        edgesArray = graph.graph.edges;
        edgesLocation = 'graph.graph.edges';
    }
    // Edge mungkin embedded di node (adjacency list)
    else if (graph.nodes?.[0]?.edges) {
        console.log('⚠️  Edge terdeteksi sebagai adjacency list di node, format belum didukung skrip ini.');
        console.log('   Silakan share struktur node pertama untuk penyesuaian.');
        process.exit(1);
    }
    else {
        console.log('❌ Tidak dapat menemukan array edge di graph.json');
        console.log('   Silakan jalankan debug mode di bawah untuk inspeksi manual.');

        // Print struktur untuk debugging
        const sample = {
            topKeys: Object.keys(graph),
            graphKeys: graph.graph ? Object.keys(graph.graph) : null,
            nodeSample: graph.nodes?.[0] ? Object.keys(graph.nodes[0]) : null,
            nodeCount: graph.nodes?.length || 0,
        };
        console.log('   Sample structure:', JSON.stringify(sample, null, 2));
        process.exit(1);
    }

    console.log(`✅ Edge ditemukan di: ${edgesLocation} (${edgesArray.length} edges)`);

    // === 1. DEDUP NODES ===
    console.log('\n🧹 Membersihkan nodes...');
    const seen = new Map();
    const dedupedNodes = [];
    let removedNodes = 0;

    for (const node of graph.nodes || []) {
        // Skip trivial nodes
        if (isTrivial(node.label)) {
            removedNodes++;
            continue;
        }

        const key = `${node.label}::${node.source_file}`;
        if (seen.has(key)) {
            const existing = seen.get(key);
            // Simpan yang punya community lebih tinggi (lebih spesifik)
            if ((node.community || 0) > (existing.community || 0)) {
                const idx = dedupedNodes.indexOf(existing);
                if (idx !== -1) {
                    dedupedNodes[idx] = node;
                    seen.set(key, node);
                }
            }
            removedNodes++;
        } else {
            seen.set(key, node);
            dedupedNodes.push(node);
        }
    }

    // === 2. FILTER EDGES ===
    console.log('🧹 Membersihkan edges...');
    const filteredEdges = [];
    let removedEdges = 0;

    for (const edge of edgesArray) {
        // Skip inferred edges dengan confidence rendah
        if (edge.confidence === 'INFERRED' && (edge.confidence_score || 0) < 0.8) {
            removedEdges++;
            continue;
        }
        filteredEdges.push(edge);
    }

    // === 3. TULIS HASIL ===
    console.log('\n💾 Menyimpan hasil...');

    graph.nodes = dedupedNodes;

    // Tulis kembali ke lokasi yang sama
    if (edgesLocation === 'graph.links') {
        graph.links = filteredEdges;
    } else if (edgesLocation === 'graph.edges') {
        graph.edges = filteredEdges;
    } else if (edgesLocation === 'graph.graph.links') {
        graph.graph.links = filteredEdges;
    } else if (edgesLocation === 'graph.graph.edges') {
        graph.graph.edges = filteredEdges;
    }

    writeFileSync(GRAPH_PATH, JSON.stringify(graph, null, 2));

    console.log('\n✨ Selesai!');
    console.log(`   Nodes: ${dedupedNodes.length} (removed ${removedNodes})`);
    console.log(`   Edges: ${filteredEdges.length} (removed ${removedEdges})`);
    console.log(`   Edge location: ${edgesLocation}`);

    // Hitung community count
    const communityCount = new Map();
    for (const node of dedupedNodes) {
        const name = node.community_name;
        if (name) {
            communityCount.set(name, (communityCount.get(name) || 0) + 1);
        }
    }
    console.log(`   Communities: ${[...communityCount.keys()].length}`);
}

try {
    main();
} catch (err) {
    console.error('❌ Error:', err.message);
    console.error('\nStack:', err.stack);
    process.exit(1);
}