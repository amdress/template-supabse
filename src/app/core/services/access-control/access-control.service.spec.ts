import { TestBed } from '@angular/core/testing';
import { AccessControlService } from './access-control.service';
import { RoleService } from './role/role.service';
import { PermissionService } from './permission/permission.service';
import { UserService } from './user/user.service';
import { DbConnectionService } from '../db_supabase/db_conection.service';

describe('AccessControlService', () => {
  let service: AccessControlService;
  let mockSupabase: any;

  const mockRole = { id: 'role-123', name: 'user' };

  const dbConnectionServiceStub = {
    getClient: () => mockSupabase
  };

  const roleServiceStub = {
    getRoleByName: jasmine.createSpy().and.resolveTo(mockRole)
  };

  const permissionServiceStub = {};
  const userServiceStub = {};

  beforeEach(() => {
    mockSupabase = {
      from: jasmine.createSpy().and.returnValue({
        insert: jasmine.createSpy().and.returnValue(Promise.resolve({ error: null })),
        select: jasmine.createSpy().and.returnValue({
          eq: jasmine.createSpy().and.returnValue(Promise.resolve({ data: [], error: null }))
        }),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        AccessControlService,
        { provide: DbConnectionService, useValue: dbConnectionServiceStub },
        { provide: RoleService, useValue: roleServiceStub },
        { provide: PermissionService, useValue: permissionServiceStub },
        { provide: UserService, useValue: userServiceStub },
      ]
    });

    service = TestBed.inject(AccessControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should assign default role to user', async () => {
    const userId = 'user-123';
    
    await service.assignDefaultRoleToUser(userId);

    expect(roleServiceStub.getRoleByName).toHaveBeenCalledWith('user');
    expect(mockSupabase.from).toHaveBeenCalledWith('user_roles');
  });

  it('should assign specific role to user', async () => {
    const userId = 'user-123';
    const roleName = 'admin';

    await service.assignRoleToUser(userId, roleName);

    expect(roleServiceStub.getRoleByName).toHaveBeenCalledWith('admin');
    expect(mockSupabase.from).toHaveBeenCalledWith('user_roles');
  });

  it('should return true if user has the permission', async () => {
    const userId = 'user-123';

    const fakeData = [{
      roles: [{
        role_permissions: [
          { permissions: { name: 'read' } },
          { permissions: { name: 'write' } }
        ]
      }]
    }];

    mockSupabase.from = jasmine.createSpy().and.returnValue({
      select: jasmine.createSpy().and.returnValue({
        eq: jasmine.createSpy().and.returnValue(Promise.resolve({ data: fakeData, error: null }))
      })
    });

    const result = await service.hasPermission(userId, 'write');
    expect(result).toBeTrue();
  });

  it('should return false if user does not have the permission', async () => {
    const userId = 'user-123';

    const fakeData = [{
      roles: [{
        role_permissions: [
          { permissions: { name: 'read' } }
        ]
      }]
    }];

    mockSupabase.from = jasmine.createSpy().and.returnValue({
      select: jasmine.createSpy().and.returnValue({
        eq: jasmine.createSpy().and.returnValue(Promise.resolve({ data: fakeData, error: null }))
      })
    });

    const result = await service.hasPermission(userId, 'delete');
    expect(result).toBeFalse();
  });
});
