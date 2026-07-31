import { TestBed } from '@angular/core/testing';

import { ToolbarService } from './tmyts-toolbar-service';

describe('ToolbarService', () => {
  let service: ToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDialogType returns the matching entry for a known id', () => {
    const result = service.getDialogType('portfolio');
    expect(result?.title).toBe('Portfolios');
  });

  it('getDialogType returns the assets_analysis entry with its nested dialog config', () => {
    const result = service.getDialogType('assets_analysis');
    expect(result?.dialog?.dialog_title).toBe('Select asset');
  });

  it('getDialogType returns undefined for an unknown id', () => {
    expect(service.getDialogType('does-not-exist')).toBeUndefined();
  });

  it('dialogTypes exposes exactly the five known dashboard ids', () => {
    const ids = service.dialogTypes().map((d) => d.id);
    expect(ids).toEqual(['portfolio', 'live_tracker', 'assets_analysis', 'live_data', 'control-panel']);
  });
});
