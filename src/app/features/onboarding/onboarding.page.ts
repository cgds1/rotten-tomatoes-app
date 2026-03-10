import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { register } from 'swiper/element/bundle';

register();

const ONBOARDING_KEY = 'hasSeenOnboarding';

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  styleUrls: ['onboarding.page.scss'],
  standalone: false,
})
export class OnboardingPage implements AfterViewInit {
  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;

  currentSlide = 0;
  totalSlides = 3;

  constructor(
    private router: Router,
    private storage: StorageService,
  ) {}

  ngAfterViewInit(): void {
    const swiperEl = this.swiperRef.nativeElement;
    const params = {
      slidesPerView: 1,
      speed: 400,
      allowTouchMove: true,
    };
    Object.assign(swiperEl, params);
    swiperEl.initialize();

    swiperEl.addEventListener('swiperslidechange', () => {
      this.currentSlide = swiperEl.swiper.activeIndex;
    });
  }

  next(): void {
    if (this.currentSlide < this.totalSlides - 1) {
      this.swiperRef.nativeElement.swiper.slideNext();
    } else {
      this.completeOnboarding();
    }
  }

  skip(): void {
    this.completeOnboarding();
  }

  private async completeOnboarding(): Promise<void> {
    await this.storage.set(ONBOARDING_KEY, true);
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
