import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { GamesService } from '../../shared/services/games.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { ReplaceNullImgPipe } from '../../shared/pipe/replace-null-img.pipe';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceMock: Partial<AuthService>;
  let gamesServiceMock: Partial<GamesService>;
  let spinnerServiceMock: Partial<SpinnerService>;
  let routerMock: Partial<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let dialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    // Mock the services
    authServiceMock = {
      user$: of({ uid: 'user1', displayName: 'Test User', email: 'test@example.com' }),
      getAvatarById: jest.fn().mockResolvedValue({ photoUrl: 'mock-avatar-url' }),
      updateUserInfo: jest.fn()
    };

    gamesServiceMock = {
      getGameById: jest.fn().mockResolvedValue({ games: [] }),
      removeGameFromUser: jest.fn().mockResolvedValue(true)
    };

    spinnerServiceMock = {
      proceedSpinnerStatus: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    activatedRouteMock = {};

    dialogMock = {
      open: jest.fn().mockReturnValue({
        afterClosed: () => of(true)
      })
    };

    // Configure testing module
    await TestBed.configureTestingModule({
      imports: [ReplaceNullImgPipe],
      declarations: [ProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: GamesService, useValue: gamesServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatDialogRef, useValue: {} }, // Mock MatDialogRef
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ChangeDetectorRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the profile component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.updateUserInfoForm).toBeInstanceOf(FormGroup);
    expect(component.updateUserInfoForm.controls['displayName'].value).toBe('');
    expect(component.updateUserInfoForm.controls['photoUrl'].value).toBe('');
    expect(component.updateUserInfoForm.controls['email'].value).toBe('');
  });

  it('should load user data on init', () => {
    // Calling ngOnInit manually
    component.ngOnInit();

    // Expect user data to be loaded
    expect(authServiceMock.getAvatarById).toHaveBeenCalledWith('user1');
    expect(component.user).toEqual({ uid: 'user1', displayName: 'Test User', email: 'test@example.com' });
    expect(component.userAvatar).toBe('mock-avatar-url');
  });

  it('should change user info status', () => {
    component.changeUserInfo(true);
    expect(component.updateUserInfoStatus).toBe(true);

    component.changeUserInfo(false);
    expect(component.updateUserInfoStatus).toBe(false);
  });

  it('should navigate to game details when goToGame is called', () => {
    const gameId = 1;
    component.goToGame(gameId);
    expect(routerMock.navigate).toHaveBeenCalledWith([`/games/${gameId}`], { relativeTo: activatedRouteMock });
  });

  it('should update user info and handle errors', async () => {
    component.updateUserInfoForm.setValue({ displayName: 'Updated Name', photoUrl: '', email: 'updated@example.com' });

    await component.submitUpdateUserForm();

    // Check if spinner is activated
    expect(spinnerServiceMock.proceedSpinnerStatus).toHaveBeenCalledWith(true);
    expect(authServiceMock.updateUserInfo).toHaveBeenCalledWith('Updated Name', 'updated@example.com', 'mock-avatar-url');
    expect(spinnerServiceMock.proceedSpinnerStatus).toHaveBeenCalledWith(false);
  });

  it('should open confirmation dialog when removing a game', () => {
    const gameInfo = { id: 1, name: 'Test Game' };
    component.removeGames(gameInfo);

    // Check if the dialog is opened
    expect(dialogMock.open).toHaveBeenCalled();
  });

  it('should call removeGameFromUser and update user games after confirmation', async () => {
    component.removeGames({ id: 1, name: 'Test Game' });

    // Wait for the dialog to close
    expect(gamesServiceMock.removeGameFromUser).toHaveBeenCalled();
    expect(gamesServiceMock.getGameById).toHaveBeenCalled();
  });

});
