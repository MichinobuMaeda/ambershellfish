import 'package:cloud_firestore/cloud_firestore.dart';
import 'firestore_model.dart';

class Account extends FirestoreModel {
  static const fieldName = 'name';
  static const fieldEmail = 'email';
  static const fieldGroup = 'group';
  static const fieldValid = 'valid';
  static const fieldAdmin = 'admin';
  static const fieldTester = 'tester';
  static const fieldThemeMode = 'themeMode';

  const Account(DocumentSnapshot<Map<String, dynamic>> snap) : super(snap);

  String get name => getValue<String>(fieldName, '');
  String get email => getValue<String>(fieldEmail, '');
  String get group => getValue<String>(fieldGroup, '');
  bool get valid => getValue<bool>(fieldValid, false);
  bool get admin => getValue<bool>(fieldAdmin, false);
  bool get tester => getValue<bool>(fieldTester, false);
  int get themeMode => getValue<int>(fieldThemeMode, 0);

  @override
  List<Object?> get props => super.props
    ..addAll([
      name,
      email,
      group,
      valid,
      admin,
      tester,
      themeMode,
    ]);
}
