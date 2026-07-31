import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrollService } from '../service/scroll.service';
import { MusicasService } from '../musicas/musicas.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { RegistryClassification, SharedValidators } from '../shared/validators';


type TrackMode = 'trackNoStems' | 'trackWithStems' | 'effectsFx';

type Option = { value: string; label: string };

@Component({
    selector: 'app-produtores',
    templateUrl: './produtores.component.html',
    styleUrls: ['./produtores.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ProdutoresComponent implements OnInit {
  @ViewChild('errorSummaryRef') errorSummaryRef?: ElementRef;

  form: FormGroup;
  submitted = false;
  errorSummary: string[] = [];

  readonly trackModes: Option[] = [
    { value: 'trackNoStems', label: 'Single track' },
    { value: 'trackWithStems', label: 'Single track + Stems' },
    { value: 'effectsFx', label: 'Efeitos (FX)' },
  ];

  readonly countryCodeOptions: string[] = [
    'BR +55',
    'US +1',
    'PT +351',
    'AR +54',
    'MX +52',
  ];

  readonly categoryOptions: string[] = [
    'Social Media',
    'World Music',
    'Beats',
    'Instrumentos Épicos',
    'Sound Effects',
    'Games',
  ];

  readonly keyOptions: Option[] = [
    { value: 'A_MAJOR', label: 'A (Lá Maior)' },
    { value: 'A_SHARP_MAJOR', label: 'A# (Lá Sustenido Maior)' },
    { value: 'A_FLAT_MAJOR', label: 'Ab (Lá Bemol Maior)' },
    { value: 'B_MAJOR', label: 'B (Si Maior)' },
    { value: 'B_FLAT_MAJOR', label: 'Bb (Si Bemol Maior)' },
    { value: 'C_MAJOR', label: 'C (Dó Maior)' },
    { value: 'C_SHARP_MAJOR', label: 'C# (Dó Sustenido Maior)' },
    { value: 'D_MAJOR', label: 'D (Ré Maior)' },
    { value: 'D_SHARP_MAJOR', label: 'D# (Ré Sustenido Maior)' },
    { value: 'E_MAJOR', label: 'E (Mi Maior)' },
    { value: 'F_MAJOR', label: 'F (Fá Maior)' },
    { value: 'F_SHARP_MAJOR', label: 'F# (Fá Sustenido Maior)' },
    { value: 'G_MAJOR', label: 'G (Sol Maior)' },
    { value: 'G_SHARP_MAJOR', label: 'G# (Sol Sustenido Maior)' },
    { value: 'A_MINOR', label: 'Am (Lá Menor)' },
    { value: 'A_SHARP_MINOR', label: 'A#m (Lá Sustenido Menor)' },
    { value: 'A_FLAT_MINOR', label: 'Abm (Lá Bemol Menor)' },
    { value: 'B_MINOR', label: 'Bm (Si Menor)' },
    { value: 'B_FLAT_MINOR', label: 'Bbm (Si Bemol Menor)' },
    { value: 'C_MINOR', label: 'Cm (Dó Menor)' },
    { value: 'C_SHARP_MINOR', label: 'C#m (Dó Sustenido Menor)' },
    { value: 'D_MINOR', label: 'Dm (Ré Menor)' },
    { value: 'D_SHARP_MINOR', label: 'D#m (Ré Sustenido Menor)' },
    { value: 'E_MINOR', label: 'Em (Mi Menor)' },
    { value: 'F_MINOR', label: 'Fm (Fá Menor)' },
    { value: 'F_SHARP_MINOR', label: 'F#m (Fá Sustenido Menor)' },
    { value: 'G_MINOR', label: 'Gm (Sol Menor)' },
    { value: 'G_SHARP_MINOR', label: 'G#m (Sol Sustenido Menor)' },
  ];

  generos: string[] = [];

  private readonly stemsControls = ['stemMelodyFile', 'stemHarmonyFile', 'stemDrumsFile', 'stemFxFile'];
  private readonly effectsControls = ['fx1', 'fx2', 'fx3', 'fx4', 'fx5', 'fx6'];

  constructor(
    private snackBar: MatSnackBar,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private musicService: MusicasService,
    private uploadFileService: UploadFileService,
    private host: ElementRef,
  ) {
    this.form = this.fb.group({
      track_stems: ['trackNoStems', Validators.required],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['BR +55', Validators.required],
      phone: ['', [Validators.required, SharedValidators.phoneWithDDD()]],
      identification: ['', [Validators.required, SharedValidators.identification()]],
      trackName: ['', Validators.required],
      category: ['', Validators.required],
      genrePrimary: ['', Validators.required],
      bpm: ['', [Validators.required, SharedValidators.bpm(1, 300)]],
      key: ['', Validators.required],
      registryValue: [''],
      externalLink: ['', SharedValidators.optionalHttpUrl()],
      loop15File: [null, Validators.required],
      loop30File: [null, Validators.required],
      loop60File: [null, Validators.required],
      singleTrackFile: [null, Validators.required],
      stemMelodyFile: [null],
      stemHarmonyFile: [null],
      stemDrumsFile: [null],
      stemFxFile: [null],
      fx1: [null],
      fx2: [null],
      fx3: [null],
      fx4: [null],
      fx5: [null],
      fx6: [null],
      politicaDePrivacidade: [false, Validators.requiredTrue],
    });
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
    this.loadGenres();

    this.form.get('track_stems')?.valueChanges.subscribe((mode: TrackMode) => {
      this.applyModeValidators(mode);
    });

    this.applyModeValidators(this.currentMode());
  }

  isMode(mode: TrackMode): boolean {
    return this.currentMode() === mode;
  }

  hasError(controlName: string, errorName: string = 'required'): boolean {
    const ctrl = this.form.get(controlName);
    if (!ctrl) return false;
    return ctrl.hasError(errorName) && (ctrl.touched || ctrl.dirty || this.submitted);
  }

  onUpload(): void {
    this.submitted = true;
    this.errorSummary = [];
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.buildErrorSummary();
      this.snackBar.open('Corrija os erros destacados antes de enviar.', '', { duration: 5000 });
      this.scrollToErrorSummary();
      this.focusFirstInvalidControl();
      return;
    }

    const mode = this.currentMode();
    this.buildDurations(mode)
      .then((durations) => {
        const durationErrors = this.validateDurations(mode, durations);
        if (durationErrors.length > 0) {
          this.errorSummary = durationErrors;
          this.snackBar.open(durationErrors[0], '', { duration: 6000 });
          this.scrollToErrorSummary();
          return;
        }

        const fd = this.buildFormData(mode, durations);

        this.uploadFileService.uploadProducerTrack(fd).subscribe({
          next: () => {
            this.snackBar.open('Upload enviado com sucesso!', '', { duration: 4000 });
          },
          error: (err) => {
            const message = err?.error?.message || 'Erro ao enviar upload.';
            this.snackBar.open(message, '', { duration: 6000 });
          },
        });
      })
      .catch(() => {
        this.errorSummary = ['Não foi possível calcular as durações dos áudios enviados.'];
        this.snackBar.open(this.errorSummary[0], '', { duration: 6000 });
      });
  }

  private loadGenres(): void {
    this.musicService.getGeneros().subscribe({
      next: (data: any) => {
        const fromApi = this.normalizeOptions(data);
        this.generos = fromApi.length ? fromApi : this.getFallbackGenres();
      },
      error: () => {
        this.generos = this.getFallbackGenres();
      }
    });
  }

  private normalizeOptions(data: any): string[] {
    if (!Array.isArray(data)) return [];
    const normalized = data
      .map((item) => String(item ?? '').trim())
      .filter(Boolean);
    return Array.from(new Set(normalized));
  }

  private getFallbackGenres(): string[] {
    const serviceAny: any = this.musicService as any;
    const rawGenero = serviceAny?.genero;
    if (Array.isArray(rawGenero) && rawGenero.length > 0) {
      const first = rawGenero[0];
      if (first && typeof first === 'object') {
        const keys = Object.keys(first)
          .map((item) => String(item ?? '').trim())
          .filter(Boolean);
        if (keys.length > 0) {
          return keys;
        }
      }
    }

    const convertida2 = serviceAny?.convertida2;
    if (Array.isArray(convertida2) && convertida2.length > 0) {
      return this.normalizeOptions(convertida2);
    }

    return ['Rock', 'Pop', 'Eletrônica (EDM)'];
  }

  private currentMode(): TrackMode {
    const mode = this.form.get('track_stems')?.value;
    if (mode === 'trackWithStems' || mode === 'effectsFx') {
      return mode;
    }
    return 'trackNoStems';
  }

  private applyModeValidators(mode: TrackMode): void {
    this.stemsControls.forEach((name) => {
      const ctrl = this.form.get(name);
      if (!ctrl) return;
      ctrl.clearValidators();
      if (mode === 'trackWithStems') {
        ctrl.setValidators([Validators.required]);
      } else {
        ctrl.reset(null, { emitEvent: false });
      }
      ctrl.updateValueAndValidity({ emitEvent: false });
    });

    this.effectsControls.forEach((name) => {
      const ctrl = this.form.get(name);
      if (!ctrl) return;
      ctrl.clearValidators();
      if (mode === 'effectsFx') {
        ctrl.setValidators([Validators.required]);
      } else {
        ctrl.reset(null, { emitEvent: false });
      }
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private buildFormData(mode: TrackMode, durations: any): FormData {
    const fd = new FormData();
    const registry: RegistryClassification = SharedValidators.classifyRegistryRaw(this.form.get('registryValue')?.value);

    const track = this.form.get('singleTrackFile')?.value as File;
    fd.append('schemaVersion', 'producer_form_v2');
    fd.append('mode', mode);
    fd.append('track', track);

    fd.append('loop15', this.form.get('loop15File')?.value as File);
    fd.append('loop30', this.form.get('loop30File')?.value as File);
    fd.append('loop60', this.form.get('loop60File')?.value as File);

    if (mode === 'trackWithStems') {
      fd.append('stem_melody', this.form.get('stemMelodyFile')?.value as File);
      fd.append('stem_harmony', this.form.get('stemHarmonyFile')?.value as File);
      fd.append('stem_drums', this.form.get('stemDrumsFile')?.value as File);
      fd.append('stem_fx', this.form.get('stemFxFile')?.value as File);
    }

    if (mode === 'effectsFx') {
      this.effectsControls.forEach((controlName, index) => {
        fd.append(`effect${index + 1}`, this.form.get(controlName)?.value as File);
      });
    }

    const phoneRaw = String(this.form.get('phone')?.value ?? '');
    const phoneDigits = phoneRaw.replace(/\D+/g, '');

    const meta: any = {
      artistName: this.form.get('nome')?.value,
      email: this.form.get('email')?.value,
      countryCode: this.form.get('countryCode')?.value,
      phone: phoneRaw,
      phoneDigits,
      identification: this.form.get('identification')?.value,
      trackName: this.form.get('trackName')?.value,
      category: this.form.get('category')?.value,
      genre: this.form.get('genrePrimary')?.value,
      bpm: Number(this.form.get('bpm')?.value),
      key: this.form.get('key')?.value,
      externalLink: this.form.get('externalLink')?.value || null,
      registryRaw: registry.registryRaw,
      registryType: registry.registryType,
      registryValue: registry.registryValue,
      isrc: registry.isrc,
      upc: registry.upc,
      hashType: registry.hashType,
      termsAccepted: !!this.form.get('politicaDePrivacidade')?.value,
      durations,
    };

    fd.append('meta', JSON.stringify(meta));

    return fd;
  }

  private async getFileDurationMs(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          const d = Math.round((audio.duration || 0) * 1000);
          URL.revokeObjectURL(audio.src);
          resolve(d);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audio.src);
          reject(new Error('Falha ao carregar metadados do áudio.'));
        };
        audio.src = URL.createObjectURL(file);
      } catch (err) {
        reject(err);
      }
    });
  }

  private async buildDurations(mode: TrackMode): Promise<any> {
    const result: any = {};

    const track = this.form.get('singleTrackFile')?.value as File | null;
    if (track) {
      result.track_ms = await this.getFileDurationMs(track);
    }

    const loop15 = this.form.get('loop15File')?.value as File | null;
    const loop30 = this.form.get('loop30File')?.value as File | null;
    const loop60 = this.form.get('loop60File')?.value as File | null;
    if (loop15) result.loop15_ms = await this.getFileDurationMs(loop15);
    if (loop30) result.loop30_ms = await this.getFileDurationMs(loop30);
    if (loop60) result.loop60_ms = await this.getFileDurationMs(loop60);

    if (mode === 'trackWithStems') {
      const melody = this.form.get('stemMelodyFile')?.value as File | null;
      const harmony = this.form.get('stemHarmonyFile')?.value as File | null;
      const drums = this.form.get('stemDrumsFile')?.value as File | null;
      const fx = this.form.get('stemFxFile')?.value as File | null;

      if (melody) result.stem_melody_ms = await this.getFileDurationMs(melody);
      if (harmony) result.stem_harmony_ms = await this.getFileDurationMs(harmony);
      if (drums) result.stem_drums_ms = await this.getFileDurationMs(drums);
      if (fx) result.stem_fx_ms = await this.getFileDurationMs(fx);

      result.stems_ms = [
        result.stem_melody_ms,
        result.stem_harmony_ms,
        result.stem_drums_ms,
        result.stem_fx_ms,
      ].filter((value) => Number.isFinite(value));
    }

    if (mode === 'effectsFx') {
      const effectsDurations: number[] = [];
      this.effectsControls.forEach((name, index) => {
        const file = this.form.get(name)?.value as File | null;
        if (!file) return;
        effectsDurations.push(0);
        result[`effect${index + 1}_ms`] = 0;
      });

      for (let i = 0; i < this.effectsControls.length; i++) {
        const file = this.form.get(this.effectsControls[i])?.value as File | null;
        if (!file) continue;
        const duration = await this.getFileDurationMs(file);
        effectsDurations[i] = duration;
        result[`effect${i + 1}_ms`] = duration;
      }

      result.effects_ms = effectsDurations.filter((value) => Number.isFinite(value) && value > 0);
    }

    return result;
  }

  private validateDurations(mode: TrackMode, durations: any): string[] {
    const errors: string[] = [];
    const tolerance = 200;
    const trackMs = Number(durations?.track_ms || 0);

    if (!trackMs) {
      errors.push('Não foi possível obter a duração do arquivo Single Track.');
      return errors;
    }

    const isSameDuration = (candidate: number) => Math.abs(candidate - trackMs) <= tolerance;

    const loopChecks = [
      { label: 'Loop 15s', key: 'loop15_ms', expected: 15000 },
      { label: 'Loop 30s', key: 'loop30_ms', expected: 30000 },
      { label: 'Loop 60s', key: 'loop60_ms', expected: 60000 },
    ];
    loopChecks.forEach(({ label, key, expected }) => {
      const value = Number(durations?.[key] || 0);
      if (!value || Math.abs(value - expected) > tolerance) {
        errors.push(`${label} deve ter exatamente ${expected / 1000}s (±200ms).`);
      }
    });

    if (mode === 'trackWithStems') {
      const entries = [
        { label: 'Melodias', value: Number(durations?.stem_melody_ms || 0) },
        { label: 'Harmonias', value: Number(durations?.stem_harmony_ms || 0) },
        { label: 'Ritmos', value: Number(durations?.stem_drums_ms || 0) },
        { label: 'Efeitos', value: Number(durations?.stem_fx_ms || 0) },
      ];

      entries.forEach((item) => {
        if (!item.value || !isSameDuration(item.value)) {
          errors.push(`${item.label} deve ter a mesma duração do Single Track (±200ms).`);
        }
      });
    }

    if (mode === 'effectsFx') {
      for (let i = 1; i <= 6; i++) {
        const value = Number(durations?.[`effect${i}_ms`] || 0);
        if (!value || !isSameDuration(value)) {
          errors.push(`Efeito ${i} deve ter a mesma duração do Single Track (±200ms).`);
        }
      }
    }

    return Array.from(new Set(errors));
  }

  private buildErrorSummary(): void {
    const f = this.form;
    const msgs: string[] = [];

    if (f.get('nome')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Nome / Nome Artístico'));

    if (f.get('email')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Email'));
    else if (f.get('email')?.hasError('email')) msgs.push(SharedValidators.getInvalidEmailMessage('Email'));

    if (f.get('countryCode')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Código'));

    if (f.get('phone')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Telefone + DDD'));
    else if (f.get('phone')?.hasError('phone')) msgs.push(SharedValidators.getErrorMessage(f.get('phone'), 'phone') || 'Telefone inválido.');

    if (f.get('identification')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Nº de Identificação'));
    else if (f.get('identification')?.hasError('identification')) msgs.push(SharedValidators.getErrorMessage(f.get('identification'), 'identification') || 'Identificação inválida.');

    if (f.get('trackName')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Nome da Música'));
    if (f.get('category')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Gênero'));
    if (f.get('genrePrimary')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Humor'));

    if (f.get('bpm')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('BPM'));
    else if (f.get('bpm')?.hasError('bpm')) msgs.push(SharedValidators.getErrorMessage(f.get('bpm'), 'bpm') || 'BPM inválido.');

    if (f.get('key')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Tom'));

    if (f.get('externalLink')?.hasError('url')) msgs.push(SharedValidators.getErrorMessage(f.get('externalLink'), 'url') || 'Link inválido.');

    if (f.get('loop15File')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Loop 15s'));
    if (f.get('loop30File')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Loop 30s'));
    if (f.get('loop60File')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Loop 60s'));

    if (f.get('singleTrackFile')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Single Track'));

    if (this.currentMode() === 'trackWithStems') {
      if (f.get('stemMelodyFile')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Melodias (strings)'));
      if (f.get('stemHarmonyFile')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Harmonias (chords)'));
      if (f.get('stemDrumsFile')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Ritmos (drums)'));
      if (f.get('stemFxFile')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Efeitos (FX)'));
    }

    if (this.currentMode() === 'effectsFx') {
      this.effectsControls.forEach((name, index) => {
        if (f.get(name)?.hasError('required')) {
          msgs.push(SharedValidators.getRequiredMessage(`Efeito ${index + 1}`));
        }
      });
    }

    if (f.get('politicaDePrivacidade')?.hasError('required')) msgs.push('É obrigatório aceitar os Termos e condições.');

    this.errorSummary = Array.from(new Set(msgs));
  }

  private scrollToErrorSummary(): void {
    if (this.errorSummaryRef?.nativeElement) {
      this.errorSummaryRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  private focusFirstInvalidControl(): void {
    try {
      const root: HTMLElement = this.host?.nativeElement as HTMLElement;
      if (!root) return;
      const invalid = root.querySelector('form .ng-invalid[formcontrolname], form .ng-invalid input, form .ng-invalid textarea') as HTMLElement | null;
      if (!invalid) return;
      if (typeof (invalid as any).focus === 'function') {
        (invalid as any).focus();
      }
    } catch (_e) {
      // noop
    }
  }
}
