import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/account.dart';
import '../models/auth_user.dart';
import '../models/conf.dart';
import 'accounts_bloc.dart';
import 'auth_bloc.dart';
import 'conf_bloc.dart';
import 'groups_bloc.dart';
import 'user_bloc.dart';
import 'platform_bloc.dart';
import 'repository_request_delegate_bloc.dart';

class AllBlocsObserver extends BlocObserver {
  late RepositoryRequestBloc repositoryRequestBloc;
  late PlatformBloc platformBloc;
  late ConfBloc confBloc;
  late AuthBloc authBloc;
  late UserBloc userBloc;
  late AccountsBloc accountsBloc;
  late GroupsBloc groupsBloc;

  @override
  void onCreate(BlocBase bloc) {
    if (bloc is RepositoryRequestBloc) {
      repositoryRequestBloc = bloc;
    } else if (bloc is PlatformBloc) {
      platformBloc = bloc;
    } else if (bloc is ConfBloc) {
      confBloc = bloc;
    } else if (bloc is AuthBloc) {
      authBloc = bloc;
    } else if (bloc is UserBloc) {
      userBloc = bloc;
    } else if (bloc is AccountsBloc) {
      accountsBloc = bloc;
    } else if (bloc is GroupsBloc) {
      groupsBloc = bloc;
    }
    super.onCreate(bloc);
  }

  @override
  void onChange(BlocBase bloc, Change change) {
    try {
      if (bloc is ConfBloc) {
        final Conf? state = change.nextState;

        authBloc.add(AuthUrlChanged(state?.url));
        userBloc.add(OnConfUpdated(state));
      } else if (bloc is AuthBloc) {
        final AuthUser? state = change.nextState;

        userBloc.add(OnAuthUserUpdated(state));
      } else if (bloc is AccountsBloc) {
        final List<Account> state = change.nextState;

        userBloc.add(OnAccountsUpdated(state));
      } else if (bloc is UserBloc) {
        final UserState? current = change.currentState;
        final UserState? state = change.nextState;

        if (state != null) {
          // Signed in
          if (current?.me == null && state.me != null) {
            restoreAllUserData(state.me!);

            if (platformBloc.state.themeMode > 0) {
              try {
                repositoryRequestBloc.add(
                  RepositoryRequest(
                    request: () => accountsBloc.updateMyAccount(
                      {
                        Account.fieldThemeMode: platformBloc.state.themeMode,
                      },
                    ),
                    onSuccess: () {},
                    onError: () {
                      debugPrint(
                        'error: on RepositoryRequest '
                        'updateMyAccount themeMode',
                      );
                    },
                  ),
                );
              } catch (e) {
                debugPrint('RepositoryRequestBloc has not be initialized.');
              }
            }
          }

          // Signed out
          if (current?.me != null && state.me == null) {
            discardAllUserData();
          }

          if (state.me != null) {
            if (current?.me?.themeMode != state.me!.themeMode &&
                state.me!.themeMode > 0) {
              platformBloc.add(MyThemeModeUpdated(state.me!.themeMode));
            }
          }
        }
      }
    } catch (e, s) {
      debugPrint('$e\n$s');
    }

    super.onChange(bloc, change);
  }

  void restoreAllUserData(Account me) {
    accountsBloc.add(AccountsSubscribed(me));
    confBloc.add(ConfSubscribed(me));
    groupsBloc.add(GroupsSubscribed(me));
  }

  Future<void> discardAllUserData() async {
    debugPrint('discardAllUserData()');
    groupsBloc.add(GroupsUnsubscribed());
    confBloc.add(ConfUnsubscribed());
    accountsBloc.add(AccountsUnsubscribed());
    await Future.delayed(const Duration(milliseconds: 300));
    await authBloc.signOut();
  }
}
