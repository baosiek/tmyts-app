import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';

import { AssetModel, createNewAsset } from '../../../models/asset-model';
import { AppConfigService } from '../../../services/app-config/app-config-service';
import { DialogData } from '../general-dialog/general-dialog';
import { SelectAssetDialog } from './select-asset-dialog';

function asset(overrides: Partial<AssetModel> = {}): AssetModel {
  return { ...createNewAsset(), asset: 'AAPL', asset_name: 'Apple Inc.', ...overrides };
}

describe('SelectAssetDialog', () => {
  let component: SelectAssetDialog;
  let fixture: ComponentFixture<SelectAssetDialog>;
  let httpMock: HttpTestingController;
  let dialogRef: jasmine.SpyObj<MatDialogRef<SelectAssetDialog>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [SelectAssetDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AppConfigService, useValue: { apiBaseUrl: 'http://localhost:8000', wsBaseUrl: 'ws://localhost:8001' } },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectAssetDialog);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    const dialogData: DialogData = { title: 'Select asset', content: SelectAssetDialog, data: new Map() };
    fixture.componentRef.setInput('dialogData', dialogData);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('searchTerm quick-searches the typed asset and populates searchResults', () => {
    component.assetSelectionForm.get('asset')?.setValue('AAP');
    component.searchTerm(new KeyboardEvent('keyup'));

    const req = httpMock.expectOne('http://localhost:8000/assets/quick_search/?search_term=AAP');
    expect(req.request.method).toBe('GET');
    req.flush([asset()]);

    expect(component.searchResults()).toEqual([asset()]);
  });

  it('searchTerm does nothing when the field is empty', () => {
    component.assetSelectionForm.get('asset')?.setValue('');
    component.searchTerm(new KeyboardEvent('keyup'));

    httpMock.expectNone(() => true);
    expect(component.searchResults()).toEqual([]);
  });

  it('onSelectionChange closes the dialog with the selected asset', () => {
    const option = { value: asset() } as MatListOption;

    component.onSelectionChange([option]);

    expect(dialogRef.close).toHaveBeenCalledWith(new Map<string, AssetModel>([['asset', asset()]]));
  });

  it('onEnterKey closes the dialog when the typed value matches a search result', () => {
    component.assetSelectionForm.get('asset')?.setValue('aapl');
    component.searchResults.set([asset()]);

    component.onEnterKey();

    expect(dialogRef.close).toHaveBeenCalledWith(new Map<string, AssetModel>([['asset', asset()]]));
  });

  it('onEnterKey does not close the dialog when the typed value matches nothing', () => {
    component.assetSelectionForm.get('asset')?.setValue('nope');
    component.searchResults.set([asset()]);

    component.onEnterKey();

    expect(dialogRef.close).not.toHaveBeenCalled();
  });
});
