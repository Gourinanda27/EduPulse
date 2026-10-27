import { Post } from '../types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    slug: 'transformers-self-attention-modern-ai',
    title: 'Understanding Transformers & Self-Attention: The Engine Behind Modern LLMs',
    subtitle: 'A visual, mathematical, and intuitive walkthrough of Query, Key, Value vectors and how self-attention transformed AI forever.',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    readTimeMinutes: 8,
    publishDate: 'Oct 24, 2026',
    author: {
      name: 'Dr. Elena Rostova',
      role: 'Research Scientist at Cognitive Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Deep learning researcher specializing in attention mechanisms and transformer interpretability.'
    },
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    tags: ['Machine Learning', 'NLP', 'Transformers', 'Deep Learning', 'PyTorch'],
    featured: true,
    likes: 342,
    views: 1820,
    tableOfContents: [
      { id: 'why-rnns-failed', title: 'Why Traditional RNNs and LSTMs Hit a Wall', level: 2 },
      { id: 'qkv-intuition', title: 'The Core Intuition: Queries, Keys, and Values', level: 2 },
      { id: 'mathematical-formulation', title: 'The Mathematics of Scaled Dot-Product Attention', level: 2 },
      { id: 'multi-head-power', title: 'Why Multi-Head Attention Matters', level: 2 },
      { id: 'code-implementation', title: 'Python / PyTorch Code Implementation', level: 2 },
      { id: 'interactive-summary', title: 'Key Takeaways & Conceptual Summary', level: 2 }
    ],
    content: `
## Why Traditional RNNs and LSTMs Hit a Wall

Before the landmark 2017 paper *"Attention Is All You Need"* by Vaswani et al., sequence modeling was dominated by Recurrent Neural Networks (RNNs) and Long Short-Term Memory networks (LSTMs).

While clever, RNNs processed tokens sequentially: token $t$ could only be processed after token $t-1$. This sequential bottleneck caused two fatal flaws:
1. **Vanishing/Exploding Gradients:** Information from tokens 50 steps ago was compressed through dozens of matrix multiplications, losing critical long-range dependencies.
2. **Inability to Parallelize:** Modern GPU hardware thrives on massive matrix parallelization. Sequential loops left thousands of GPU cores idle during training.

> [!NOTE]
> Transformers replaced sequential processing with **full-sequence parallel matrix multiplications**. Every token attends to every other token simultaneously in $O(1)$ sequential operations.

---

## The Core Intuition: Queries, Keys, and Values

The greatest breakthrough in the Transformer architecture is **Self-Attention**, inspired by database retrieval systems:

- **Query ($Q$):** What this specific token is searching for or inquiring about.
- **Key ($K$):** What this token advertises or has to offer to other tokens.
- **Value ($V$):** The actual informational content that will be retrieved if a Key matches a Query.

Imagine reading the sentence:
> *"The bank of the river was muddy."*

When the model processes the ambiguous word **"bank"**, its **Query** searches for surrounding contextual clues. The word **"river"** presents a **Key** strongly related to bodies of water. The dot product between "bank" ($Q$) and "river" ($K$) produces a massive attention weight, ensuring the contextual **Value** extracted leans toward geographical shorelines rather than financial institutions.

---

## The Mathematics of Scaled Dot-Product Attention

The exact formulation for attention is defined as:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V$$

Let's break down each component:
- **$Q K^T$:** Dot-product similarity matrix between all queries and keys. For a sequence of length $N$, this produces an $N \\times N$ attention matrix where entry $(i, j)$ represents the affinity of token $i$ towards token $j$.
- **$\\sqrt{d_k}$ Scaling Factor:** When embedding dimensions $d_k$ become large (e.g., $d_k = 64$ or $128$), the dot products grow substantially in magnitude. Large values push the softmax function into regions with near-zero gradients (saturation). Dividing by $\\sqrt{d_k}$ normalizes the variance to 1.
- **$\\text{softmax}(\\cdot)$:** Normalizes scores across each row so the attention weights sum to 1.0 (a valid probability distribution).
- **Multiply by $V$:** Computes the final weighted sum of value representations.

> [!TIP]
> The scaled factor $\\frac{1}{\\sqrt{d_k}}$ is what allows stable gradient flow across deep 96-layer LLMs like GPT-4!

---

## Why Multi-Head Attention Matters

A single attention head can only focus on one type of relationship at a time (e.g., matching verbs to direct objects). 

**Multi-Head Attention** projects $Q, K, V$ into $h$ distinct subspaces (typically $h=8$ or $16$):

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O$$

$$\\text{where } \\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$

One head can track syntactic agreement (singular vs plural), another tracks coreference ("it" refers to "robot"), while another tracks sentiment cues.

---

## Python / PyTorch Code Implementation

Here is a clean, minimal PyTorch implementation of the Scaled Dot-Product Attention function:

\`\`\`python
import torch
import torch.nn.functional as F
import math

def scaled_dot_product_attention(Q, K, V, mask=None):
    """
    Q, K, V: [batch_size, num_heads, seq_len, d_k]
    mask: Optional [seq_len, seq_len] tensor for causal masking
    """
    d_k = Q.size(-1)
    
    # 1. Compute dot-product affinity scores: [B, H, S, S]
    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)
    
    # 2. Apply causal mask (optional, used in autoregressive generation)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
        
    # 3. Softmax to obtain attention weights
    attention_weights = F.softmax(scores, dim=-1)
    
    # 4. Weighted combination of values
    output = torch.matmul(attention_weights, V)
    
    return output, attention_weights

# Example usage:
B, H, S, D = 2, 4, 8, 64
q = torch.randn(B, H, S, D)
k = torch.randn(B, H, S, D)
v = torch.randn(B, H, S, D)

context, weights = scaled_dot_product_attention(q, k, v)
print("Context shape:", context.shape) # [2, 4, 8, 64]
print("Weights shape:", weights.shape) # [2, 4, 8, 8]
\`\`\`

---

## Key Takeaways & Conceptual Summary

1. **Parallelism:** Eliminates recurrent recurrence; processes the entire sequence at once.
2. **Dynamic Weights:** Unlike fixed convolution filters, attention weights are calculated on-the-fly based on token interactions.
3. **Foundation of LLMs:** Scaled dot-product attention powers GPT, Claude, Gemini, BERT, LLaMA, and Vision Transformers (ViT).
`,
    quizzes: [
      {
        id: 'q1-1',
        question: 'Why do we divide the dot product QK^T by sqrt(d_k) in scaled dot-product attention?',
        options: [
          'To make the matrix multiplication run faster on GPUs',
          'To prevent dot products from becoming excessively large, which causes vanishing gradients in softmax',
          'To enforce causal masking so future tokens are not visible',
          'To convert floating-point values into integers'
        ],
        correctIndex: 1,
        explanation: 'For large values of d_k, dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients. Dividing by sqrt(d_k) stabilizes the variance.'
      },
      {
        id: 'q1-2',
        question: 'What is the primary computational advantage of Transformers over traditional RNNs?',
        options: [
          'Transformers require less GPU memory than RNNs for infinite sequences',
          'Transformers process all tokens simultaneously, unlocking massive GPU parallelization during training',
          'Transformers do not require positional encodings',
          'Transformers use fewer total parameters than small RNNs'
        ],
        correctIndex: 1,
        explanation: 'Because Transformers do not rely on sequential hidden state recurrence, all tokens in a training sequence are processed concurrently with tensor matrix operations.'
      }
    ],
    flashcards: [
      {
        id: 'fc1-1',
        front: 'What does Query (Q) represent in self-attention?',
        back: 'The representation of what the current token is looking for in other tokens.',
        hint: 'Think of searching a database.'
      },
      {
        id: 'fc1-2',
        front: 'What is the formula for Scaled Dot-Product Attention?',
        back: 'Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V',
        hint: 'Involves Q, K transpose, sqrt(d_k), softmax, and V.'
      }
    ]
  },
  {
    id: 'post-2',
    slug: 'secrets-of-big-o-notation-and-time-complexity',
    title: 'The Secrets of Time Complexity & Big-O Notation: From O(1) to O(2^n)',
    subtitle: 'Master the asymptotic analysis of algorithms with intuitive real-world analogies, visual charts, and practical optimization rules.',
    category: 'Computer Science',
    difficulty: 'Beginner',
    readTimeMinutes: 6,
    publishDate: 'Oct 22, 2026',
    author: {
      name: 'Marcus Vance',
      role: 'Staff Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Author of High Performance Systems and competitive programming coach.'
    },
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    tags: ['Algorithms', 'Data Structures', 'Computer Science', 'Big-O', 'Optimization'],
    featured: false,
    likes: 278,
    views: 1450,
    tableOfContents: [
      { id: 'why-hardware-benchmarks-lie', title: 'Why Hardware Benchmarks Lie', level: 2 },
      { id: 'the-growth-hierarchy', title: 'The Hierarchy of Computational Growth', level: 2 },
      { id: 'step-by-step-analysis', title: 'How to Calculate Big-O Step-by-Step', level: 2 },
      { id: 'space-vs-time', title: 'The Space vs. Time Complexity Trade-off', level: 2 },
      { id: 'practical-code-examples', title: 'Common Algorithm Complexities in Code', level: 2 }
    ],
    content: `
## Why Hardware Benchmarks Lie

If you run an algorithm on a modern Apple M4 chip, it might complete in 4 milliseconds. If you run the exact same code on a budget micro-controller, it might take 400 milliseconds.

Measuring execution time in seconds is deceptive because it depends on:
- CPU clock speed & cache size
- Operating system background tasks
- Compiler optimizations
- Memory bandwidth

**Big-O Notation** solves this by measuring **how an algorithm's runtime scales as the input size $n$ approaches infinity**, independent of hardware.

---

## The Hierarchy of Computational Growth

Here is the operational efficiency spectrum, ordered from fastest to slowest:

| Notation | Name | Practical Example | Rating |
| :--- | :--- | :--- | :--- |
| **$O(1)$** | Constant | Hash map lookup, array indexing by index | Outstanding |
| **$O(\\log n)$** | Logarithmic | Binary search in a sorted array | Fantastic |
| **$O(n)$** | Linear | Iterating through an unsorted array | Fair |
| **$O(n \\log n)$** | Linearithmic | Merge Sort, QuickSort (average case) | Acceptable |
| **$O(n^2)$** | Quadratic | Nested loops, Bubble sort | Dangerous for large $N$ |
| **$O(2^n)$** | Exponential | Naive recursive Fibonacci, subset generation | Intractable for $N > 40$ |
| **$O(n!)$** | Factorial | Traveling Salesperson brute force | Disaster |

> [!IMPORTANT]
> For $n = 1,000,000$:
> - An $O(\\log n)$ algorithm performs approximately **20 operations**.
> - An $O(n)$ algorithm performs **1,000,000 operations**.
> - An $O(n^2)$ algorithm performs **1,000,000,000,000 operations** (taking days or weeks)!

---

## How to Calculate Big-O Step-by-Step

Follow these 3 universal rules:

1. **Drop Constant Multipliers:**
   $O(3n + 5) \\implies O(n)$
   Constants do not change the curve of growth at scale.
2. **Drop Lower-Order Terms:**
   $O(n^2 + 50n + 1000) \\implies O(n^2)$
   As $n \\to \\infty$, $n^2$ completely dominates $50n$.
3. **Multiply for Nested Iterations, Add for Sequential:**
   Two sequential loops of size $n$ are $O(n + n) = O(n)$.
   Two nested loops of size $n$ are $O(n \\times n) = O(n^2)$.

---

## Practical Code Examples

Let's inspect how simple algorithmic choices shift complexity:

\`\`\`typescript
// O(1) - Constant Time
function getFirstElement<T>(items: T[]): T | undefined {
  return items[0]; // Instant array pointer offset
}

// O(log n) - Binary Search
function binarySearch(sortedArr: number[], target: number): number {
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// O(n^2) - Nested Loop (Avoid in high-throughput APIs)
function findDuplicateNaive(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n) - Optimized using Hash Set (Trading space for time)
function findDuplicateOptimized(arr: number[]): boolean {
  const seen = new Set<number>();
  for (const num of arr) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
\`\`\`

---

## Key Takeaway
Always design with worst-case growth in mind. When you encounter nested loops on user-controlled inputs, ask yourself: *"Can I trade $O(n)$ additional memory (e.g., using a Set or HashMap) to reduce time complexity from $O(n^2)$ to $O(n)$?"* In 95% of web engineering tasks, the answer is a resounding yes!
`,
    quizzes: [
      {
        id: 'q2-1',
        question: 'If an algorithm has a complexity of O(n^3 + 500n^2 + 10000), what is its asymptotic Big-O classification?',
        options: ['O(10000)', 'O(n^2)', 'O(n^3)', 'O(n^5)'],
        correctIndex: 2,
        explanation: 'In asymptotic analysis, we drop constants and all lower-order terms because n^3 dominates the runtime as n becomes very large.'
      },
      {
        id: 'q2-2',
        question: 'How many iterations will Binary Search take in the worst case for an array with 1,024 elements?',
        options: ['1,024', '512', '10', '100'],
        correctIndex: 2,
        explanation: 'log2(1024) = 10. Binary search cuts the search space in half with every step, so at most 10 comparisons are needed.'
      }
    ],
    flashcards: [
      {
        id: 'fc2-1',
        front: 'What does O(log n) mean in practice?',
        back: 'The number of operations increases by 1 each time the input size doubles.',
        hint: 'Think of halving the search space repeatedly.'
      },
      {
        id: 'fc2-2',
        front: 'What is the average time complexity of QuickSort and MergeSort?',
        back: 'O(n log n)',
        hint: 'Linearithmic complexity.'
      }
    ]
  },
  {
    id: 'post-3',
    slug: 'quantum-computing-superposition-qubits',
    title: 'Quantum Computing Demystified: Superposition, Entanglement, and Qubits',
    subtitle: 'Step beyond classical binary bits. How quantum mechanics allows computers to explore exponentially vast computational states simultaneously.',
    category: 'Physics & Science',
    difficulty: 'Advanced',
    readTimeMinutes: 10,
    publishDate: 'Oct 20, 2026',
    author: {
      name: 'Prof. Julian Sterling',
      role: 'Chair of Quantum Information, Cavendish Laboratory',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      bio: 'Pioneering researcher in superconducting qubits and topological quantum error correction.'
    },
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    tags: ['Quantum', 'Physics', 'Computing', 'Qubits', 'Science'],
    featured: false,
    likes: 412,
    views: 2190,
    tableOfContents: [
      { id: 'classical-vs-quantum', title: 'Classical Bits vs. Quantum Bits (Qubits)', level: 2 },
      { id: 'bloch-sphere', title: 'The Bloch Sphere Geometric Representation', level: 2 },
      { id: 'superposition-principle', title: 'The Superposition Principle', level: 2 },
      { id: 'quantum-entanglement', title: 'Entanglement: Spooky Action at a Distance', level: 2 },
      { id: 'quantum-gates', title: 'Basic Quantum Logic Gates (Hadamard & CNOT)', level: 2 }
    ],
    content: `
## Classical Bits vs. Quantum Bits (Qubits)

Every smartphone, supercomputer, and server today relies on the classical **bit**: a microscopic physical state representing strictly **0** (off) or **1** (on).

A **qubit** (quantum bit), however, exploits quantum mechanical phenomena:
$$\\vert \\psi \\rangle = \\alpha \\vert 0 \\rangle + \\beta \\vert 1 \\rangle$$

Where:
- $\\vert 0 \\rangle$ and $\\vert 1 \\rangle$ are the standard computational orthonormal basis states.
- $\\alpha$ and $\\beta$ are **complex probability amplitudes**.
- The sum of probability magnitudes satisfies:

$$\\vert \\alpha \\vert^2 + \\vert \\beta \\vert^2 = 1$$

When you measure the qubit, the quantum state collapses instantly to either state $0$ with probability $\\vert \\alpha \\vert^2$, or state $1$ with probability $\\vert \\beta \\vert^2$. Before measurement, it exists in a true quantum superposition of both.

---

## The Bloch Sphere Geometric Representation

While a classical bit can only be at the North Pole (0) or South Pole (1), a pure single qubit state can be visualized as any point on the surface of a three-dimensional unit sphere called the **Bloch Sphere**:

$$\\vert \\psi \\rangle = \\cos\\left(\\frac{\\theta}{2}\\right) \\vert 0 \\rangle + e^{i\\phi} \\sin\\left(\\frac{\\theta}{2}\\right) \\vert 1 \\rangle$$

Here:
- $\\theta \\in [0, \\pi]$ controls the polar angle (probability weighting).
- $\\phi \\in [0, 2\\pi)$ represents the quantum phase angle.

Quantum gates are essentially three-dimensional spatial rotations of this vector around the Bloch sphere!

---

## The Superposition Principle & Exponential State Space

Consider a system of $n$ qubits:
- 1 qubit requires $2^1 = 2$ complex numbers to describe.
- 2 qubits require $2^2 = 4$ complex numbers.
- 50 qubits require $2^{50} \\approx 1.12 \\times 10^{15}$ numbers.
- **300 qubits** require $2^{300}$ amplitudes—a number exceeding the total estimated atoms in the observable universe!

> [!NOTE]
> A quantum computer with 300 entangled qubits can simultaneously manipulate a state space larger than any classical computer ever constructed.

---

## Quantum Entanglement: Spooky Action at a Distance

When two qubits become **entangled**, their physical properties cannot be described independently:

$$\\vert \\Phi^+ \\rangle = \\frac{1}{\\sqrt{2}} (\\vert 00 \\rangle + \\vert 11 \\rangle)$$

In this Bell state:
- Neither qubit has a definite state on its own.
- If Qubit A is measured and found to be $0$, Qubit B collapses immediately to $0$.
- If Qubit A is measured and found to be $1$, Qubit B collapses immediately to $1$.
- This instantaneous correlation holds even if the two qubits are separated across opposite edges of the galaxy.

---

## Basic Quantum Logic Gates

In quantum computing, logic operations must be **reversible** and represented by unitary matrices ($U^\\dagger U = I$):

1. **Hadamard Gate ($H$):** Creates equal superposition from a basis state.
   $$H \\vert 0 \\rangle = \\frac{\\vert 0 \\rangle + \\vert 1 \\rangle}{\\sqrt{2}}$$
2. **Pauli-X Gate ($X$):** The quantum NOT gate, rotating $180^\\circ$ around the X-axis.
3. **Controlled-NOT (CNOT):** Entangles two qubits; flips the target qubit if and only if the control qubit is $\\vert 1 \\rangle$.
`,
    quizzes: [
      {
        id: 'q3-1',
        question: 'What is the sum of the squared absolute values of the probability amplitudes (|alpha|^2 + |beta|^2) for any valid qubit?',
        options: ['0', '0.5', '1.0', 'Infinity'],
        correctIndex: 2,
        explanation: 'Because the total probability of all possible measurement outcomes must equal 100%, |alpha|^2 + |beta|^2 is strictly normalized to 1.'
      },
      {
        id: 'q3-2',
        question: 'Which quantum logic gate is used to place a qubit from state |0> into an equal superposition?',
        options: ['Pauli-Z Gate', 'Hadamard Gate (H)', 'CNOT Gate', 'Toffoli Gate'],
        correctIndex: 1,
        explanation: 'The Hadamard gate maps basis states |0> and |1> into balanced superpositions (|0> + |1>)/sqrt(2).'
      }
    ],
    flashcards: [
      {
        id: 'fc3-1',
        front: 'What is the Bloch Sphere?',
        back: 'A geometric representation of the state space of a single two-level quantum mechanical system (qubit).',
        hint: 'A 3D unit sphere.'
      },
      {
        id: 'fc3-2',
        front: 'What happens when an entangled pair of qubits is measured?',
        back: 'Measuring one qubit instantly determines the measurement outcome of the other, regardless of spatial distance.',
        hint: 'Einstein called it "spooky action at a distance".'
      }
    ]
  },
  {
    id: 'post-4',
    slug: 'mastering-modern-css-grid-and-subgrid',
    title: 'Mastering Modern CSS Grid & Subgrid: The Modern Layout Revolution',
    subtitle: 'From fractional units and auto-fit minmax to nested subgrid alignments. Build rock-solid responsive layouts with zero JavaScript hacks.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    readTimeMinutes: 7,
    publishDate: 'Oct 19, 2026',
    author: {
      name: 'Maya Lin',
      role: 'Principal Design Technologist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      bio: 'CSS Working Group contributor and frontend architecture specialist.'
    },
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    tags: ['CSS', 'Web Development', 'Design Systems', 'CSS Grid', 'Frontend'],
    featured: false,
    likes: 195,
    views: 980,
    tableOfContents: [
      { id: 'why-flexbox-isnt-enough', title: 'Why Flexbox Isn’t Always Enough', level: 2 },
      { id: 'the-holy-grail-autofit', title: 'The Holy Grail Responsive Grid: auto-fit + minmax', level: 2 },
      { id: 'subgrid-explained', title: 'The Power of CSS Subgrid', level: 2 },
      { id: 'practical-code-patterns', title: 'Production Ready Layout Patterns', level: 2 }
    ],
    content: `
## Why Flexbox Isn’t Always Enough

Web developers frequently confuse **Flexbox** and **CSS Grid**:
- **Flexbox is 1-Dimensional:** Designed to lay out items along a single axis (row or column). Wrap behavior treats each wrapped row as an independent flex container.
- **CSS Grid is 2-Dimensional:** Coordinates rows and columns simultaneously. It aligns elements strictly in both directions.

If you need cards in different rows to have identical column widths and aligned footer buttons, Flexbox requires ugly fixed-width workarounds. CSS Grid solves this natively.

---

## The Holy Grail Responsive Grid: auto-fit + minmax

The most powerful line of modern CSS allows you to build an intrinsically responsive multi-column card grid without writing a single \`@media\` query:

\`\`\`css
.responsive-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\`

### How it works:
1. \`minmax(280px, 1fr)\`: Each card must be at least 280px wide. If space permits, it expands to claim equal fractions (\`1fr\`) of the remaining room.
2. \`auto-fit\`: The browser fits as many 280px columns as will fit on screen, collapsing unused empty tracks to 0.

> [!TIP]
> Use **auto-fit** when you want items to stretch and fill the entire row width. Use **auto-fill** when you want new empty columns to be reserved even if there are not enough items.

---

## The Power of CSS Subgrid

Until recently, child elements inside grid items had their own independent internal layouts. If card titles or descriptions had varying line counts, card footers would be misaligned.

With **CSS Subgrid**, child items inherit the exact tracks of their parent grid:

\`\`\`css
.card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.card {
  display: grid;
  /* Card spans 3 rows in the parent coordinate system */
  grid-row: span 3;
  /* Subgrid adopts the parent rows! */
  grid-template-rows: subgrid;
}
\`\`\`

Now, all card headers across all cards are locked into row 1, all descriptions in row 2, and all action buttons in row 3—ensuring pixel-perfect alignment across cards!
`,
    quizzes: [
      {
        id: 'q4-1',
        question: 'What is the primary difference between CSS Grid and Flexbox?',
        options: [
          'CSS Grid is one-dimensional while Flexbox is two-dimensional',
          'CSS Grid is two-dimensional (rows and columns) while Flexbox is one-dimensional (single axis)',
          'CSS Grid only works on desktop browsers',
          'Flexbox does not support gap property'
        ],
        correctIndex: 1,
        explanation: 'Flexbox works along one axis at a time, whereas Grid coordinates both rows and columns simultaneously.'
      }
    ],
    flashcards: [
      {
        id: 'fc4-1',
        front: 'What does CSS Subgrid allow a nested child grid to do?',
        back: 'Inherit the track definitions (rows or columns) of its parent grid, aligning nested content across sibling cards.',
        hint: 'grid-template-rows: subgrid'
      }
    ]
  },
  {
    id: 'post-5',
    slug: 'the-beauty-of-eulers-identity',
    title: 'The Beauty of Euler’s Identity: Why e^(i*pi) + 1 = 0 Stuns Mathematicians',
    subtitle: 'Connecting the five most fundamental constants in mathematics into a single profound relationship using complex numbers and Taylor series.',
    category: 'Mathematics',
    difficulty: 'Intermediate',
    readTimeMinutes: 5,
    publishDate: 'Oct 15, 2026',
    author: {
      name: 'Dr. Aris Thorne',
      role: 'Professor of Pure Mathematics',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'Number theorist and popularizer of visual mathematics and geometry.'
    },
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    tags: ['Mathematics', 'Calculus', 'Complex Analysis', 'Euler', 'Geometry'],
    featured: false,
    likes: 512,
    views: 3100,
    tableOfContents: [
      { id: 'the-five-constants', title: 'The Five Foundational Constants', level: 2 },
      { id: 'eulers-formula', title: 'Euler’s General Formula', level: 2 },
      { id: 'the-proof-taylor-series', title: 'The Taylor Series Proof', level: 2 },
      { id: 'geometric-rotation', title: 'Geometric Meaning: Rotation in the Complex Plane', level: 2 }
    ],
    content: `
## The Five Foundational Constants

Physicist Richard Feynman described Euler's identity as *"the most remarkable formula in mathematics."* It unites five constants from completely different mathematical realms:

1. **$e \\approx 2.71828$:** The base of natural logarithms, governing continuous compounding and calculus rate of change.
2. **$i = \\sqrt{-1}$:** The imaginary unit, extending the 1D number line into the 2D complex plane.
3. **$\\pi \\approx 3.14159$:** The ratio of a circle's circumference to its diameter, fundamental to geometry and periodic waves.
4. **$1$:** The multiplicative identity, foundational to counting and arithmetic.
5. **$0$:** The additive identity, foundational to algebra and set theory.

$$e^{i\\pi} + 1 = 0$$

---

## Euler’s General Formula

Euler proved that for any real number $x$:

$$e^{ix} = \\cos(x) + i \\sin(x)$$

When we substitute $x = \\pi$:
- $\\cos(\\pi) = -1$
- $\\sin(\\pi) = 0$

Therefore:
$$e^{i\\pi} = -1 + i(0) = -1$$

Adding $1$ to both sides gives the celebrated identity:
$$e^{i\\pi} + 1 = 0$$

---

## The Taylor Series Proof

We can rigorously verify this identity by expanding each term into its Taylor/Maclaurin series centered at $0$:

$$e^z = 1 + z + \\frac{z^2}{2!} + \\frac{z^3}{3!} + \\frac{z^4}{4!} + \\dots$$

Substitute $z = ix$:
$$e^{ix} = 1 + ix - \\frac{x^2}{2!} - i\\frac{x^3}{3!} + \\frac{x^4}{4!} + i\\frac{x^5}{5!} - \\dots$$

Grouping real and imaginary parts:
$$e^{ix} = \\left(1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\dots\\right) + i \\left(x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots\\right)$$

Notice that:
- The real part is precisely the Taylor series for $\\cos(x)$!
- The imaginary part is precisely the Taylor series for $\\sin(x)$!

Hence, $e^{ix} = \\cos(x) + i \\sin(x)$ is proven.

---

## Geometric Meaning: Rotation in the Complex Plane

Multiplication by $i$ represents a $90^\\circ$ counter-clockwise rotation in the complex plane. 

When you compute $e^{ix}$, the parameter $x$ represents an angle in **radians** along the unit circle. Evaluating $e^{i\\pi}$ rotates by exactly $\\pi$ radians ($180^\\circ$), landing squarely at point $(-1, 0)$ on the real axis!
`,
    quizzes: [
      {
        id: 'q5-1',
        question: 'In the complex plane, what geometric operation does multiplying a complex number by e^(i*theta) represent?',
        options: [
          'A scaling dilation by factor theta',
          'A reflection across the imaginary axis',
          'A counter-clockwise rotation by angle theta radians',
          'A projection onto the real axis'
        ],
        correctIndex: 2,
        explanation: 'Multiplying by e^(i*theta) rotates the vector counter-clockwise by theta radians while preserving its magnitude (length 1).'
      }
    ],
    flashcards: [
      {
        id: 'fc5-1',
        front: 'State Euler’s Formula for any real number x.',
        back: 'e^(ix) = cos(x) + i*sin(x)',
        hint: 'Relates complex exponential to cosine and sine.'
      }
    ]
  },
  {
    id: 'post-6',
    slug: 'crispr-cas9-molecular-scissors-gene-editing',
    title: 'CRISPR-Cas9 Gene Editing: How Molecular Scissors are Rewriting Biology',
    subtitle: 'From bacterial immune defense to clinical cures for sickle cell disease. Discover how RNA-guided nucleases enable targeted genomic precision.',
    category: 'Biology & Genetics',
    difficulty: 'Beginner',
    readTimeMinutes: 7,
    publishDate: 'Oct 12, 2026',
    author: {
      name: 'Dr. Sarah Jenkins',
      role: 'Molecular Biologist & CRISPR Therapeutics Fellow',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      bio: 'Investigating genome editing delivery vectors and Cas enzyme variants.'
    },
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    tags: ['Biology', 'Genetics', 'CRISPR', 'Biotechnology', 'Medicine'],
    featured: false,
    likes: 310,
    views: 1670,
    tableOfContents: [
      { id: 'bacterial-origin', title: 'The Surprising Bacterial Origins', level: 2 },
      { id: 'the-two-components', title: 'The Two Critical Components: sgRNA & Cas9', level: 2 },
      { id: 'how-repair-works', title: 'How Cellular Repair Rewrites the Code', level: 2 },
      { id: 'clinical-breakthroughs', title: 'Real Clinical Breakthroughs', level: 2 }
    ],
    content: `
## The Surprising Bacterial Origins

CRISPR stands for **Clustered Regularly Interspaced Short Palindromic Repeats**.

Long before scientists adapted it for medicine, bacteria had been using CRISPR for millions of years as an adaptive immune system against bacteriophages (viruses that attack bacteria).

When a bacterium survives a viral attack:
1. It snips a snippet of the virus's DNA.
2. It stores this viral mugshot in its CRISPR locus between repetitive spacer sequences.
3. If the virus ever attacks again, the bacterium transcribes this spacer into RNA, guides a Cas enzyme to find matching viral DNA, and cuts it into harmless pieces.

---

## The Two Critical Components: sgRNA & Cas9

In 2012, Emmanuelle Charpentier and Jennifer Doudna earned the Nobel Prize by reprogramming this bacterial system into an engineered dual-component molecular scalpel:

1. **Cas9 Protein:** An endonuclease enzyme capable of cutting both strands of double-stranded DNA.
2. **Single Guide RNA (sgRNA):** A synthetic 20-nucleotide sequence engineered by scientists to match the exact target gene in any organism.

When injected into a cell:
- The sgRNA guides Cas9 along the chromosomes until it finds the matching target adjacent to a **PAM** (Protospacer Adjacent Motif) sequence.
- Cas9 unwinds the DNA helix and makes a precise **double-strand break (DSB)**.

---

## How Cellular Repair Rewrites the Code

Once Cas9 cuts the DNA, the cell's natural DNA repair machinery takes over via one of two pathways:

1. **NHEJ (Non-Homologous End Joining):**
   - The cell hurriedly glues the severed ends together.
   - This error-prone process frequently introduces insertions or deletions (indels), effectively **knocking out** a defective disease-causing gene.
2. **HDR (Homology-Directed Repair):**
   - If scientists supply a donor DNA template alongside CRISPR, the cell uses that template to repair the break, **inserting a new, corrected genetic sequence** with pinpoint precision!
`,
    quizzes: [
      {
        id: 'q6-1',
        question: 'What is the role of sgRNA (single guide RNA) in the CRISPR-Cas9 system?',
        options: [
          'It physically cuts the DNA strands',
          'It directs the Cas9 enzyme to the specific complementary DNA target sequence',
          'It powers the Cas9 enzyme using ATP',
          'It protects the cell from UV radiation'
        ],
        correctIndex: 1,
        explanation: 'The guide RNA sequence matches the target gene and steers the Cas9 molecular scissors directly to the target locus.'
      }
    ],
    flashcards: [
      {
        id: 'fc6-1',
        front: 'What does CRISPR stand for?',
        back: 'Clustered Regularly Interspaced Short Palindromic Repeats',
        hint: 'Adaptive immune system in bacteria.'
      }
    ]
  }
];

export const CATEGORIES = [
  'All',
  'Computer Science',
  'Artificial Intelligence',
  'Mathematics',
  'Physics & Science',
  'Web Development',
  'Biology & Genetics'
] as const;
