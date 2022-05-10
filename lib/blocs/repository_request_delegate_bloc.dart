import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../config/l10n.dart';

class RepositoryRequest {
  final Future<void> Function() request;
  final String? itemName;
  final String? successMessage;
  final String? errorMessage;
  final VoidCallback? onSuccess;
  final VoidCallback? onError;

  RepositoryRequest({
    required this.request,
    this.itemName,
    this.successMessage,
    this.errorMessage,
    this.onSuccess,
    this.onError,
  });
}

class RepositoryRequestBloc extends Bloc<RepositoryRequest?, bool> {
  final BuildContext context;
  RepositoryRequestBloc(this.context) : super(false) {
    on<RepositoryRequest>((event, emit) async {
      emit(true);
      try {
        await event.request();
        if (event.onSuccess != null) {
          event.onSuccess!();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                event.successMessage ??
                    (event.itemName != null
                        ? L10n.of(context)!.successSave(event.itemName!)
                        : L10n.of(context)!.successRequest),
              ),
            ),
          );
        }
      } catch (e, s) {
        debugPrint('\n$runtimeType:on<RepositoryRequest>\n$e\n$s\n');
        if (event.onError != null) {
          event.onError!();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                event.errorMessage ??
                    (event.itemName != null
                        ? L10n.of(context)!.errorSave(event.itemName!)
                        : L10n.of(context)!.errorRequest),
              ),
            ),
          );
        }
      } finally {
        emit(false);
      }
    });
  }
}
