import { AfterViewInit, Component, ElementRef, inject, NgZone, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CareerEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
  progression?: string;
}

interface SkillGroup {
  category: string;
  skills: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly zone = inject(NgZone);
  readonly activeSection = signal('home');
  readonly menuOpen = signal(false);

  readonly navigation = [
    { id: 'home', label: 'Home' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  readonly career: CareerEntry[] = [
    {
      company: 'NielsenIQ',
      role: 'Principal Software Engineer',
      period: '2026 – Present',
      location: 'Pune, India',
      progression: 'Promoted from Senior Software Engineer',
      highlights: [
        'Architecting an end-to-end conversational analytics platform for NIQ retailer and manufacturer data, serving five analytics products.',
        'Designing a multi-agent system where a self-reflective planner coordinates analytics, metadata, and visualization agents.',
        'Building an application-agnostic MCP client with follow-up detection, guardrails, and query preprocessing.',
        'Implementing DuckDB checkpointing for in-memory analytics over Parquet files.'
      ]
    },
    {
      company: 'NielsenIQ',
      role: 'Senior Software Engineer',
      period: 'July 2024 – 2026',
      location: 'Pune, India',
      progression: 'Promoted from Mid Engineer',
      highlights: [
        'Added short-term memory checkpointing support to the MCP client.',
        'Built SSE APIs to stream model tokens and DAG execution events to the frontend in real time.',
        'Built PostgreSQL-backed agent, prompt, knowledge-base, and MCP registries with Agent Card support and PgBouncer-backed connection pooling.',
        'Built RTM and Shelf Architect MCP servers with FastMCP, enabling connections from external MCP clients such as Claude and ChatGPT.'
      ]
    },
    {
      company: 'NielsenIQ',
      role: 'Mid Engineer',
      period: 'January 2023 – June 2024',
      location: 'Pune, India',
      highlights: [
        'Built asset-management microservices with sharing and associated-asset support for 10K+ daily active users.',
        'Improved frontend load time by approximately 23% using Nginx-based static-asset caching.',
        'Resolved production rendering performance for approximately one million store locations by batching data, layering graphics, and offloading work to worker nodes.'
      ]
    },
    {
      company: 'Tata Consultancy Services · Digital Cadre',
      role: 'System Engineer',
      period: 'July 2021 – December 2022',
      location: 'Pune, India',
      highlights: [
        'Developed a report-management landing page with recursive folder navigation for an Adhoc Analysis application.',
        'Built “Add to Story” functionality to export BI-generated reports into organisation-specific PowerPoint templates.'
      ]
    }
  ];

  readonly skills: SkillGroup[] = [
    {
      category: 'Languages',
      skills: ['Python', 'Java', 'TypeScript']
    },
    {
      category: 'AI & LLM Engineering',
      skills: ['Agentic AI', 'Multi-agent systems', 'MCP', 'A2A', 'RAG', 'Prompt engineering', 'Semantic search', 'HITL', 'AI evaluation']
    },
    {
      category: 'Frameworks & Libraries',
      skills: ['LangChain', 'LangGraph', 'OpenAI', 'Azure OpenAI', 'FastAPI', 'FastMCP', 'Spring AI', 'Angular']
    },
    {
      category: 'Data & Search',
      skills: ['PostgreSQL', 'MongoDB', 'Snowflake', 'DuckDB', 'Polars', 'FAISS', 'PgVector', 'OpenSearch']
    },
    {
      category: 'Cloud, Delivery & Tools',
      skills: ['Azure', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'SonarQube', 'Cycode', 'Datadog', 'Artifactory', 'Confluence', 'Git', 'Bitbucket']
    }
  ];

  readonly impact = [
    { value: '10K+', label: 'daily active users supported' },
    { value: '5', label: 'NIQ analytics products served by the AI platform backend' },
    { value: '~23%', label: 'faster page loads through caching' },
    { value: '~1M', label: 'store locations rendered at scale' }
  ];

  readonly awards = [
    '2026 AI Engineering Innovative Team of the Year',
    '2025 Top Performer of the Year',
    'Q1 2025 Quarterly Award',
    'Microsoft Azure & AI certified: AI-104, AI-900, AZ-204, AZ-104, AZ-900'
  ];

  private revealObserver?: IntersectionObserver;
  private sectionObserver?: IntersectionObserver;
  private pointerMoveHandler?: (event: PointerEvent) => void;
  private pointerLeaveHandler?: () => void;

  ngAfterViewInit(): void {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const revealElements = document.querySelectorAll<HTMLElement>('[data-reveal]');

    if (!reducedMotion && finePointer) {
      const reticle = this.host.nativeElement.querySelector<HTMLElement>('.cursor-reticle');

      if (reticle) {
        const pointerMoveHandler = (event: PointerEvent) => {
          reticle.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
          reticle.classList.add('is-active');
          const target = event.target;
          const isTarget = target instanceof Element && target.closest('a, button, .career-entry, .impact-item, .about-card, .skill-group, .skill-tags span') !== null;
          reticle.classList.toggle('is-target', isTarget);
        };
        const pointerLeaveHandler = () => reticle.classList.remove('is-active', 'is-target');
        this.pointerMoveHandler = pointerMoveHandler;
        this.pointerLeaveHandler = pointerLeaveHandler;

        this.zone.runOutsideAngular(() => {
          this.host.nativeElement.addEventListener('pointermove', pointerMoveHandler, { passive: true });
          this.host.nativeElement.addEventListener('pointerleave', pointerLeaveHandler, { passive: true });
        });
      }
    }

    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(element => element.classList.add('is-visible'));
    } else {
      this.revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          this.revealObserver?.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

      revealElements.forEach(element => this.revealObserver?.observe(element));
    }

    this.sectionObserver = new IntersectionObserver(entries => {
      const visibleSection = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) this.activeSection.set(visibleSection.target.id);
    }, { threshold: [0.15, 0.35, 0.6], rootMargin: '-15% 0px -55% 0px' });

    document.querySelectorAll<HTMLElement>('main section[id]').forEach(section => {
      this.sectionObserver?.observe(section);
    });
  }

  navigateTo(id: string): void {
    this.menuOpen.set(false);
    this.activeSection.set(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
    this.sectionObserver?.disconnect();

    if (this.pointerMoveHandler) {
      this.host.nativeElement.removeEventListener('pointermove', this.pointerMoveHandler);
    }
    if (this.pointerLeaveHandler) {
      this.host.nativeElement.removeEventListener('pointerleave', this.pointerLeaveHandler);
    }
  }
}
